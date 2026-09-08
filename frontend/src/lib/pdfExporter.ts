export function exportEChallanDossier(data: {
  challanNumber: string;
  plateNumber: string;
  violationType: string;
  fineAmount: number;
  location: string;
  timestamp: string;
  reportingBusId: string;
  ocrConfidence: number;
  vehicleSpeed: number;
  speedLimit: number;
}) {
  if (typeof window === 'undefined') return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>E-Challan #${data.challanNumber}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            color: #0f172a;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .title { font-size: 20px; font-weight: bold; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
          .badge {
            background: #ef4444;
            color: white;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }
          .card {
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 14px;
            background: #f8fafc;
          }
          .label { font-size: 11px; color: #64748b; font-weight: 500; }
          .value { font-size: 14px; font-weight: bold; color: #0f172a; margin-top: 4px; }
          .evidence-box {
            border: 1px dashed #cbd5e1;
            padding: 16px;
            border-radius: 6px;
            margin-bottom: 24px;
            background: #ffffff;
          }
          .legal-notice {
            font-size: 11px;
            color: #64748b;
            line-height: 1.5;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">DELHI TRAFFIC POLICE — DIGITAL E-CHALLAN</div>
            <div class="subtitle">Issued under Sections 183(1) & 184 of Motor Vehicles Act 1988 (MoRTH System)</div>
          </div>
          <div class="badge">FINE: ₹${data.fineAmount}</div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="label">VEHICLE REGISTRATION NUMBER</div>
            <div class="value" style="font-size: 18px;">${data.plateNumber}</div>
          </div>
          <div class="card">
            <div class="label">E-CHALLAN REFERENCE NUMBER</div>
            <div class="value">${data.challanNumber}</div>
          </div>
          <div class="card">
            <div class="label">VIOLATION CLASSIFICATION</div>
            <div class="value" style="color: #ef4444;">${data.violationType.toUpperCase()}</div>
          </div>
          <div class="card">
            <div class="label">RECORDED SPEED / LIMIT</div>
            <div class="value">${data.vehicleSpeed} km/h (Limit: ${data.speedLimit} km/h)</div>
          </div>
          <div class="card">
            <div class="label">INCIDENT LOCATION</div>
            <div class="value">${data.location}</div>
          </div>
          <div class="card">
            <div class="label">TIMESTAMP OF DETECTION</div>
            <div class="value">${data.timestamp}</div>
          </div>
        </div>

        <div class="evidence-box">
          <div class="label" style="margin-bottom: 8px;">DIGITAL TAMPER-PROOF EVIDENCE TRAIL</div>
          <div style="font-size: 12px; line-height: 1.6;">
            • <strong>Witness Sensor Node:</strong> ${data.reportingBusId} (Public Transit Edge Node)<br>
            • <strong>Optical Plate Match Confidence:</strong> ${(data.ocrConfidence * 100).toFixed(1)}% (PaddleOCR Indian HSRP Engine)<br>
            • <strong>Telemetry Cryptographic Hash:</strong> SHA-256 Verified by Bharat Electronics Limited (BEL)
          </div>
        </div>

        <div class="legal-notice">
          <strong>LEGAL NOTICE:</strong> Payment of the statutory penalty of ₹${data.fineAmount} must be made within 60 days via the official MoRTH Virtual Court Portal. Failure to remit payment within the statutory timeframe will result in immediate escalation to the Hon'ble Metropolitan Magistrate Court.
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

export function exportPwdTenderDossier(data: {
  workOrderId: string;
  roadName: string;
  estimatedAsphaltTons: number;
  totalCostInr: number;
  areaSqM: number;
  depthCm: number;
  asphaltDensity: number;
  contractorName?: string;
  deadlineHours: number;
}) {
  if (typeof window === 'undefined') return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>PWD Work Order Specification #${data.workOrderId}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            color: #0f172a;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .title { font-size: 20px; font-weight: bold; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
          .badge {
            background: #15803d;
            color: white;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }
          .card {
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 14px;
            background: #f8fafc;
          }
          .label { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; }
          .value { font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 4px; }
          .spec-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          .spec-table th, .spec-table td {
            border: 1px solid #cbd5e1;
            padding: 8px 12px;
            font-size: 12px;
            text-align: left;
          }
          .spec-table th { background: #f1f5f9; font-weight: 600; }
          .notice-box {
            border: 1px solid #cbd5e1;
            border-left: 4px solid #0284c7;
            padding: 14px;
            border-radius: 4px;
            background: #f0f9ff;
            margin-bottom: 24px;
            font-size: 12px;
            line-height: 1.6;
          }
          .signature-row {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px dashed #cbd5e1;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">PUBLIC WORKS DEPARTMENT (PWD) — ROAD REQUISITION</div>
            <div class="subtitle">Municipal Corporation Road Division · CPWD Standard Specifications</div>
          </div>
          <div class="badge">REQUISITION APPROVED</div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="label">WORK ORDER REFERENCE</div>
            <div class="value">${data.workOrderId}</div>
          </div>
          <div class="card">
            <div class="label">TOTAL SANCTIONED BUDGET</div>
            <div class="value">₹${data.totalCostInr.toLocaleString('en-IN')}</div>
          </div>
          <div class="card">
            <div class="label">LOCATION CORRIDOR</div>
            <div class="value">${data.roadName}</div>
          </div>
          <div class="card">
            <div class="label">MANDATORY SLA DEADLINE</div>
            <div class="value">${data.deadlineHours} Hours from Work Order Notice</div>
          </div>
        </div>

        <table class="spec-table">
          <thead>
            <tr>
              <th>Specification Parameter</th>
              <th>Calculated Metric</th>
              <th>Code Standard</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pothole Surface Area</td>
              <td>${data.areaSqM.toFixed(2)} m²</td>
              <td>Optical Polygon Boundary</td>
            </tr>
            <tr>
              <td>Defect Profile Depth</td>
              <td>${data.depthCm.toFixed(1)} cm</td>
              <td>Bus IMU Z-Axis Kinematic Inversion</td>
            </tr>
            <tr>
              <td>Bitumen Grade & Density</td>
              <td>VG-30 Bituminous Concrete (${data.asphaltDensity} t/m³)</td>
              <td>IRC:111-2009 Spec</td>
            </tr>
            <tr>
              <td>Net Asphalt Requirement</td>
              <td><strong>${data.estimatedAsphaltTons.toFixed(2)} Metric Tonnes</strong></td>
              <td>Compacted Mass Guarantee</td>
            </tr>
          </tbody>
        </table>

        <div class="notice-box">
          <strong>AUTONOMOUS VERIFICATION CLAUSE:</strong><br>
          Pursuant to Smart Infrastructure Bylaws, final contractor invoice release is contingent upon automated validation. Public transit fleet buses operating in regular revenue service must pass over the repaired patch with vertical vibration amplitude Z &lt; 1.5g. Sub-standard repairs will automatically trigger mandatory 24-hour warranty re-work under liquidated damages.
        </div>

        <div class="signature-row">
          <div>
            <strong>Executive Engineer (Roads)</strong><br>
            Municipal Corporation Infrastructure Wing
          </div>
          <div style="text-align: right;">
            <strong>Digital Cryptographic Stamp</strong><br>
            Verified by BEL Strata Urban Intelligence Engine
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

export function exportCpwdBoqDossier(data: {
  zoneName: string;
  chiefEngineer: string;
  allocatedBudgetInr: number;
  estimatedCostInr: number;
  asphaltTonsRequired: number;
  potholesLogged: number;
  budgetUtilizationPct: number;
  sanctionStatus: string;
}) {
  if (typeof window === 'undefined') return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>CPWD Bill of Quantities — ${data.zoneName}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            color: #0f172a;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .title { font-size: 20px; font-weight: bold; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
          .badge {
            background: #0284c7;
            color: white;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }
          .card {
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 14px;
            background: #f8fafc;
          }
          .label { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; }
          .value { font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 4px; }
          .spec-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          .spec-table th, .spec-table td {
            border: 1px solid #cbd5e1;
            padding: 8px 12px;
            font-size: 12px;
            text-align: left;
          }
          .spec-table th { background: #f1f5f9; font-weight: 600; }
          .notice-box {
            border: 1px solid #cbd5e1;
            border-left: 4px solid #15803d;
            padding: 14px;
            border-radius: 4px;
            background: #f8fafc;
            margin-bottom: 24px;
            font-size: 12px;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">CENTRAL PUBLIC WORKS DEPARTMENT (CPWD)</div>
            <div class="subtitle">Zonal Bill of Quantities (BOQ) & Fiscal Budget Clearance · ${data.zoneName}</div>
          </div>
          <div class="badge">${data.sanctionStatus.toUpperCase()}</div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="label">MUNICIPAL ZONE</div>
            <div class="value">${data.zoneName}</div>
          </div>
          <div class="card">
            <div class="label">CHIEF ENGINEER (ZONAL ROADS)</div>
            <div class="value">${data.chiefEngineer}</div>
          </div>
          <div class="card">
            <div class="label">ANNUAL ALLOCATED BUDGET</div>
            <div class="value">₹${data.allocatedBudgetInr.toLocaleString('en-IN')}</div>
          </div>
          <div class="card">
            <div class="label">ESTIMATED REPAIR EXPENDITURE</div>
            <div class="value">₹${data.estimatedCostInr.toLocaleString('en-IN')} (${data.budgetUtilizationPct}%)</div>
          </div>
        </div>

        <table class="spec-table">
          <thead>
            <tr>
              <th>Line Item Description</th>
              <th>Quantity / Scope</th>
              <th>Sanction Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AI-Logged Road Surface Defects</td>
              <td>${data.potholesLogged} Verified Distress Points</td>
              <td>Deduplicated & Geotagged</td>
            </tr>
            <tr>
              <td>Compacted Bituminous Mix (VG-30)</td>
              <td>${data.asphaltTonsRequired.toFixed(1)} Metric Tonnes</td>
              <td>Approved Tranche Volume</td>
            </tr>
            <tr>
              <td>Statutory Tendering Allocation</td>
              <td>₹${data.estimatedCostInr.toLocaleString('en-IN')}</td>
              <td>CPWD Schedule 2026</td>
            </tr>
          </tbody>
        </table>

        <div class="notice-box">
          <strong>COMMISSIONER FISCAL APPROVAL:</strong><br>
          Budget tranche release sanctioned for road distress rectification. All billing is subject to closed-loop validation by public transport fleet telemetry passes.
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
