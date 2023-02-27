export interface IEditUser{
    idUsuario : number;
    idUsuarioAEditar : number;
    codigoLaboratorio? : String;
    nroRol: number;
    codigoProvincia? : String;
    nombreUsuario : String;
    clave : String;
    email : String;
    nombre : String;
    apellido : String;
    dni : number;
    habilitado : number;
    idIdioma : number;
}