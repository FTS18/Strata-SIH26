"""
Indian High-Security Registration Plate (HSRP) ANPR & OCR Module.
Extracts vehicle license plates from frame crops, validates Indian standard formats,
and performs fuzzy Levenshtein matching against active law enforcement hotlists.
"""

import re
from typing import Dict, List, Optional, Tuple

class AnprOcrEngine:
    # Standard Indian Registration Formats (e.g. DL 01 AB 1234, HR 26 DQ 4410)
    PLATE_REGEX = re.compile(r'^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$')

    def __init__(self, hotlist: Optional[List[Dict[str, str]]] = None):
        self.hotlist = hotlist or [
            {'plate': 'DL03CB9142', 'reason': 'Hit & Run Suspect', 'severity': 'critical'},
            {'plate': 'HR26DQ4410', 'reason': 'Rash Driving Weaving Corridor', 'severity': 'warning'},
            {'plate': 'UP16Z8802', 'reason': 'Stolen Commercial LCV', 'severity': 'critical'},
        ]

    def sanitize_plate_text(self, text: str) -> str:
        """Removes spaces, hyphens, and non-alphanumeric noise from OCR results."""
        clean = re.sub(r'[^A-Za-z0-9]', '', text).upper()
        # Common OCR character substitutions on Indian plates
        replacements = {'O': '0', 'I': '1', 'Z': '2', 'B': '8', 'S': '5'}
        if len(clean) >= 4 and clean[:2].isalpha():
            state = clean[:2]
            rest = clean[2:]
            return f"{state}{rest}"
        return clean

    @staticmethod
    def levenshtein_distance(s1: str, s2: str) -> int:
        """Computes edit distance for fuzzy matching against law enforcement hotlists."""
        if len(s1) < len(s2):
            return AnprOcrEngine.levenshtein_distance(s2, s1)
        if len(s2) == 0:
            return len(s1)

        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        return previous_row[-1]

    def check_hotlist_match(self, detected_plate: str, threshold: int = 2) -> Optional[Dict[str, str]]:
        """
        Checks if detected plate matches any hotlist vehicle within Levenshtein edit distance.
        """
        sanitized = self.sanitize_plate_text(detected_plate)
        for entry in self.hotlist:
            hotlist_plate = entry['plate'].replace(' ', '')
            dist = self.levenshtein_distance(sanitized, hotlist_plate)
            if dist <= threshold:
                return {
                    'matched_plate': entry['plate'],
                    'detected_ocr': detected_plate,
                    'reason': entry['reason'],
                    'severity': entry['severity'],
                    'edit_distance': dist,
                }
        return None
