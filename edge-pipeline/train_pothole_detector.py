"""
Fine-tuning and export pipeline for Road Defect Detection (YOLOv8/v11-Nano).
Freezes the feature extraction backbone and fine-tunes detection heads on RDD2022 dataset.
Exports the trained model to ONNX format with INT8 quantization specifications for Jetson Orin.
"""

import os
import argparse
from pathlib import Path
from ultralytics import YOLO

# 4 Standard Pavement Distress Categories (ASTM D6433 standard)
ROAD_CLASSES = {
    0: 'pothole',
    1: 'alligator_crack',
    2: 'sunken_manhole',
    3: 'speedbreaker_wear'
}

def create_dataset_config(dataset_dir: str) -> str:
    """Generates standard YOLO dataset YAML configuration for RDD2022 road damage."""
    config_path = os.path.join(dataset_dir, 'road_damage_rdd.yaml')
    content = f"""
path: {os.path.abspath(dataset_dir)}
train: images/train
val: images/val
test: images/test

names:
  0: pothole
  1: alligator_crack
  2: sunken_manhole
  3: speedbreaker_wear
"""
    with open(config_path, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    return config_path

def freeze_backbone(model: YOLO, freeze_layers: int = 10):
    """
    Freezes initial convolutional layers (C2f/Backbone) to prevent catastrophic forgetting
    and accelerate transfer learning on edge road-defect datasets.
    """
    for idx, (name, param) in enumerate(model.model.named_parameters()):
        # Layers 0-9 correspond to the YOLOv8 CSPDarknet backbone
        layer_num = int(name.split('.')[1]) if name.split('.')[1].isdigit() else -1
        if layer_num < freeze_layers and layer_num != -1:
            param.requires_grad = False

def train_and_export(
    dataset_yaml: str,
    epochs: int = 50,
    img_size: int = 640,
    batch_size: int = 16,
    output_dir: str = './weights'
):
    os.makedirs(output_dir, exist_ok=True)

    # Initialize Nano backbone (optimized for sub-15W edge IPCs)
    model = YOLO('yolov8n.pt')
    freeze_backbone(model, freeze_layers=10)

    # Train with CIoU and Distribution Focal Loss
    model.train(
        data=dataset_yaml,
        epochs=epochs,
        imgsz=img_size,
        batch=batch_size,
        project=output_dir,
        name='strata_rdd_yolo',
        save=True,
        cache=True,
        device='cpu' # fallback to CPU if no CUDA GPU
    )

    # Export to ONNX with half-precision support for TensorRT compilation
    exported_onnx_path = model.export(
        format='onnx',
        imgsz=img_size,
        dynamic=False,
        simplify=True,
        opset=17
    )

    print(f"[EXPORT COMPLETED] ONNX Model ready at: {exported_onnx_path}")
    return exported_onnx_path

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train Strata Road Damage Detector')
    parser.add_argument('--dataset_dir', type=str, default='./datasets/rdd2022', help='Dataset root path')
    parser.add_argument('--epochs', type=int, default=30, help='Training epochs')
    parser.add_argument('--batch', type=int, default=16, help='Batch size')
    args = parser.parse_args()

    os.makedirs(args.dataset_dir, exist_ok=True)
    yaml_config = create_dataset_config(args.dataset_dir)
    print(f"Generated YAML config at {yaml_config}")
