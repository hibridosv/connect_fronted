export interface User {
    id:                string;
    name:              string;
    email:             string;
    email_verified_at?: Date;
    is_visible:        number;
    must_change_password?: boolean; // Root lo activa: debe cambiar su contraseña al iniciar sesión
    status:            number;
    created_at:        Date;
    updated_at:        Date;
}