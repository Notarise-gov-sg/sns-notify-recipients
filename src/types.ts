// TODO: Obtain types from a single source of truth?
export interface TestData {
  provider: string;
  lab: string;
  swabType: string;
  patientName: string;
  swabCollectionDate: string;
  performerName: string;
  performerMcr: string;
  observationDate: string;
  nric: string;
  passportNumber: string;
  birthDate: string;
  testType: string;
  nationality: string;
  gender: string;
  testResult: string;
}

export interface Vaccination {
  vaccineCode: string;
  vaccineName: string;
  vaccineLot: string;
  vaccinationDateTime: string;
  vaccinationLocationCode: string;
  vaccinationCountry: string;
}
