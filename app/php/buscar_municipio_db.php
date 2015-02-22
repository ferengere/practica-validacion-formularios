<?php
require_once('Bd.php');

$dbinfo = "mysql:dbname=".Bd::$dbCp.";host=".Bd::$host;
$user = Bd::$user;
$pass = Bd::$pass;
//Nos intentamos conectar:
try {
    /* conectamos con bbdd e inicializamos conexión como UTF8 */
    $db = new PDO($dbinfo, $user, $pass);
    $db->exec('SET CHARACTER SET utf8');
} catch (Exception $e) {
    echo "La conexi&oacute;n ha fallado: " . $e->getMessage();
}

if (isset($_REQUEST['inputCp'])) {
    
    $cp = $_REQUEST['inputCp'];
    $sql = $db->prepare("SELECT * FROM municipios WHERE CodPostal = ?");
    $sql->bindParam(1, $cp, PDO::PARAM_STR);
    $sql->execute();
    

    if ($sql->rowCount() == 1) {
	$row = $sql->fetch();
    	$data[] = array(
        'cp' => $row['CodPostal'],
        'municipio' => $row['Municipio'],
        'provincia' => $row['Provincia']
      );
	
	
	//codificamos en json:
	$json = json_encode($data);
        $res = $json;
    } else {
       $res = "null";
    }
}
$sql=null;
$db=null;
echo $res;
?>
