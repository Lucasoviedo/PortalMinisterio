export interface INuevoLoteLab{
    idUsuario: number;
    codigoLote: string;
    nroVacuna: number;
    codigoLaboratorio: string;
    fechaRegistro: Date;
    fechaEnvio: Date;
    fechaRecepcion: Date;
    fechaVencimiento: Date;
    codigoEstado: string;
    codigoSeguimiento: string;
    idEmpresaTransporte: number;
    notificado: number;
}