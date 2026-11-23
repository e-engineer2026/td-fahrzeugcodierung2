import { test } from "node:test";
import { strict as assert } from "node:assert";
import { isPdfGuideCoding, displayPdfGuideCoding } from "../app/lib/pdfGuideCoding.ts";

test("Adaptive Spurführung bis 2023 und DLA-Einzeleintrag fehlen in PDF-Anleitungen", () => {
  assert.equal(isPdfGuideCoding({ id: "mqbevo-adaptive-lane" }), false);
  assert.equal(isPdfGuideCoding({ id: "vcds-dla" }), false);
  assert.equal(isPdfGuideCoding({ id: "vcds-fla" }), true);
  assert.equal(isPdfGuideCoding({ id: "vcds-lane-activate" }), true);
});

test("FLA und DLA haben einen gemeinsamen PDF-Titel mit DLA-Hardwarehinweis", () => {
  for (const id of ["vcds-fla", "tcross-fla"]) {
    const result = displayPdfGuideCoding({ id, name: "Fernlichtassistent aktivieren", hardware: "Frontkamera" });
    assert.equal(result.name, "Fernlichtassistent (FLA/DLA) aktivieren");
    assert.match(result.hardware, /DLA-\/Matrix-Scheinwerfer/);
    assert.match(result.hardware, /Frontkamera/);
  }
  assert.equal(displayPdfGuideCoding({ id: "vcds-lane-activate", name: "Lane Assist" }).name, "Lane Assist");
});
