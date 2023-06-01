export interface INuevaDevolucionLab{
    cantidadVacunas: number;
    codigoDevolucion: string;
    codigoLaboratorio: string;
    codigoLote: string;
    codigoSeguimiento: string;
    descripcionProblema: string;
    fechaEnvio: Date;
    fechaRecepcion: Date;
    fechaRegistro: Date;
    idEmpresaTransporte: number;
    idMotivoDevolucion: number;
    nombreLaboratorio: null;
    notificado: 0;
}