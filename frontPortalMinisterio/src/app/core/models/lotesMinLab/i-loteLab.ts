export interface ILoteLab{
    idUsuario: number;
    codigoLaboratorio: string;
    codigoEstado: string;
    codigoLote: string;
    fechaEnvio: Date;
    codigoSeguimiento: string;
    fechaRecepcion: Date;
    idEmpresaTransporte: number;
    distribuido: number;
    estado: string;
    nombreLaboratorio: string;
    fechaRegistro: Date;
    fechaVencimiento: Date;
}