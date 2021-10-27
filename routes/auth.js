const {Router} = require('express');
const { check} = require('express-validator');

const { crearUsuario, LoginUsuario, RevalidarToken, LoginSocial, ValidarEmail } = require('../controllers/auth');
const { crearBuss } = require('../controllers/servicios');

const { validarcampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({min: 8}),
    validarcampos
], crearUsuario);


router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({min: 8}),
    validarcampos
], LoginUsuario);

router.post('/loginSocial',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('img', 'La image¿n es obligatoria').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('provedor', 'El provedor es obligatorio').not().isEmpty(),
    validarcampos
], LoginSocial);

router.get('/validarEmail', [
    check('email', 'El email es obligatario').not().isEmpty(),
    validarcampos
], ValidarEmail);


router.get('/renew', validarJWT, RevalidarToken);



router.post('/newBuss', [
    check('forma_juridica', 'La forma juridica es obligatoria').not().isEmpty(),
    check('razon_social', 'La razon socila es obligatoria').not().isEmpty(),
    check('act_economica', 'La actividad economica es obligatoria').not().isEmpty(),
    check('sect_economico', 'El sector economico es obligatorio').not().isEmpty(),
    check('departamento', 'El departamento es obligatorio').not().isEmpty(),
    check('ciudad', 'La ciudad de ubicacion es obligatoria').not().isEmpty(),
    check('fec_creacion', 'La fecha de creacion es obligatoria').not().isEmpty(),
    check('contacto', 'El contacto es obligatorio').not().isEmpty(),
    validarcampos
], crearBuss);




module.exports = router;

