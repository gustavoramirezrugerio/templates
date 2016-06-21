## Gestor eLearning ##

**Guia de instalación y configuración** es la guia rapida para generar la intalacion para desarrollo

### Instalación ###

* 'git clone <usuario>@192.168.14.11:/home/repositorio_sedesol/gestorElearning.git'
* 'cd gestorElearning'
##-- * 'composer install'
##-- * 'php artisan key:generate'
##-- * Create a database and inform *.env*
##-- * 'php artisan migrate --seed' to create and populate tables
##-- * Inform *config/mail.php* for email sends
##-- * 'php artisan vendor:publish' to publish filemanager
##-- * 'php artisan serve' to start the app on http://localhost:8000/gestorElearning

### Requerimientos ###
	* jboss AS 7.1
	* jdk7 1.7.0_80
	* tomcat 7
	* Apache/2.4.6
	* MySql 5.6.31
	* PHP 5.4.16
	* NoSql(mongoDB)


### Que incluye ###

* [HTML5 Boilerplate](http://html5boilerplate.com) Para la arquitectura del front
* [Bootstrap](http://getbootstrap.com) Para CSS y Librerias de jQuery
* [Font Awesome](http://fortawesome.github.io/Font-Awesome) Iconos mas actualizados
* [CKEditor](http://ckeditor.com) Editor web
* [Filemanager](https://github.com/simogeo/Filemanager) Administrador de archivos faciles

### Caracteristicas ###

* Pagina de inicio (Publicación de cursos)
* Error de página personalizado 404
* Autenticación (registro, restablecimiento de contraseña, confirmación de correo electrónico)
* Roles de los usuarios: 
	- Administrator, tiene accesos a todos los modulos, componentes y operaciones de la aplicación
	- Coordinador, podra generar los planes de estudio, programas.
	- Profesor, se le permite visualizar el curso y dar seguimiento a los alumnos
	- Alumno, podra capacitarse en la modalidad en linea, presencial y mixto
	- Invitado, accedera a algun curso DEMO, el cual podra observar los beneficios que le ofrece a la plataforma 

### Paquetes incluidos ###

- BackEnd
	* Spring Data JPA + Bean Validation    JPA(ORM conexion a BD )		Validacion de datos
	* Liquibase	http://www.liquibase.org/	ORM

- FrontEnd
	

### Utilizar la aplicación ###

Para probar la aplicación (http://localhost:8000/gestorElearning) utilice los siguientes usuarios:

* Administrador : correo = administrador@sedesol.com.mx, password = administrador
* Coordinador : correo = cordinador@sedesol.com.mx, password = cordinador
* Profesor : correo = profesor@sedesol.com.mx, password = profesor
* Alumno : correo = alumno@sedesol.com.mx, password = alumno
* Invitado : correo = invitado@sedesol.com.mx, password = invitado


