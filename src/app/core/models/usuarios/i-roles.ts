export interface IRoles{
    nroRol: number;
    nombreRol: RolNombre;
    nombre : string;
}

enum RolNombre {
    ROL_ADMIN, ROL_PROV, ROL_LAB
}