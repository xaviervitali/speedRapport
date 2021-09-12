<?php

class GetData
{
  private $file;
  private $arr;
  public function __construct(string $file)
  {
    $this->file = $file;
  }

  private function fileToArray()
  {
    if (!file_exists($this->file)) {
      throw new \Exception("le fichier $this->file n'existe pas");
    }
    $ressource = fopen($this->file, "r");
    $data = fread($ressource,  filesize($this->file));
    $tab = explode("===", $data);
    $this->arr = $tab;
  }

  private function getLine($str, $seek, $endChr = "\n")
  {
    if (strpos($str, $seek)) {
      $start =  strpos($str, $seek) + strlen($seek);
      $end = strpos($str, $endChr, $start     + 1) - $start + strlen($endChr) - 1;
      $value = trim(str_replace("\n", "", substr($str, $start, $end)));
      return $value;
    } else {
      return "";
    }
  }

  public function dataToJson()
  {
    $json = [];
    $this->fileToArray();
    $search = ["]: ", "Download: ", "Upload: ", "Hosted by"];


    foreach ($this->arr as $e) {
      $date = str_replace("\n", "", substr(explode("n", $e)[0], 0, 20));

      $tab = [];
      $tab["date"] = $date;
      foreach ($search as $key) {
        $title = strtolower(substr($key, 0, -2));
        if ($key !== "Hosted by") {

          $value = $this->getLine($e, $key);
        } else {
          $value = $this->getLine($e, $key, ":");
        }

        if ($key == "]: ") {
          $title = "ping";
        }

        if ($key !== "Hosted by") {
          $value = substr($value, 0, strpos($value, " "));
        };
        $tab[trim($title)] = $value;
      }
      $date === "" ? "" : array_push($json, $tab);
    }

    return json_encode($json);
  }
}
$json = new GetData("speedtest.txt");
?>

<script>
  const $json = (<?php echo ($json->dataToJson()) ?>).map(

    e => {
      e.date = new Date(e.date)
      return e
    }


  )
</script>

<?php include("body.html"); ?>