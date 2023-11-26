export interface INuevoLoteProv{
    cantidadVacunas: number;
    codigoEstado: string;
    codigoLaboratorio: string;
    codigoLote: string;
    codigoProvincia: string;
    codigoSeguimiento: string;
    distribuido: number;
    estado: string;
    fechaEnvio: Date;
    fechaRecepcion: Date;
    fechaRegistro: Date;
    fechaVencimiento: Date;
    idEmpresaTransporte: number;
    nombreLab: string;
    nombreVacuna: null;
    notificado: number;
    nroVacuna: number;
}