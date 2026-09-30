import type { ComponentType } from "react";
import type { Slug } from "../data/catalog.ts";
import {
  ConstructionCorrectivePhotos,
  ConstructionDailyReport,
  ConstructionSubcontractorBoard,
} from "./construction.tsx";
import { LogisticsDriverLog } from "./logistics.tsx";
import { ManufacturingChecklistDigital, ManufacturingInspection } from "./manufacturing.tsx";
import { CareHandover, CarePaperBridge, CareShiftBoard } from "./care.tsx";
import { RestaurantOrderLoss, RestaurantShiftExit, ShiftExcelBridge } from "./food.tsx";
import { PropertyOwnerReport } from "./property.tsx";
import { FarmGapLog } from "./farm.tsx";
import { ProfessionalCaseLedger, ProfessionalIntakeBox } from "./professional.tsx";
import { EbookLawLite, FaxStructuredInbox, SmeOrderWeb, WholesaleOrderHub } from "./b2b.tsx";
import { ClinicDocExport } from "./clinic.tsx";
import { PaperFormKit } from "./paper.tsx";

export const mockViews = {
  "construction-daily-report": ConstructionDailyReport,
  "construction-corrective-photos": ConstructionCorrectivePhotos,
  "construction-subcontractor-board": ConstructionSubcontractorBoard,
  "logistics-driver-log": LogisticsDriverLog,
  "manufacturing-inspection": ManufacturingInspection,
  "manufacturing-checklist-digital": ManufacturingChecklistDigital,
  "care-handover": CareHandover,
  "care-paper-bridge": CarePaperBridge,
  "care-shift-board": CareShiftBoard,
  "shift-excel-bridge": ShiftExcelBridge,
  "restaurant-order-loss": RestaurantOrderLoss,
  "restaurant-shift-exit": RestaurantShiftExit,
  "property-owner-report": PropertyOwnerReport,
  "farm-gap-log": FarmGapLog,
  "professional-case-ledger": ProfessionalCaseLedger,
  "professional-intake-box": ProfessionalIntakeBox,
  "fax-structured-inbox": FaxStructuredInbox,
  "wholesale-order-hub": WholesaleOrderHub,
  "ebook-law-lite": EbookLawLite,
  "sme-order-web": SmeOrderWeb,
  "clinic-doc-export": ClinicDocExport,
  "paper-form-kit": PaperFormKit,
} satisfies Record<Slug, ComponentType>;
