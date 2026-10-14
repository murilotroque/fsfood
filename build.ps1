# ============================================================
# FoodRadar — build single-file
# Gera dist/foodradar.html com CSS e JS embutidos, para abrir
# em qualquer lugar (ou publicar) sem depender dos arquivos
# soltos. Uso:  powershell -ExecutionPolicy Bypass -File build.ps1
# ============================================================
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dist = Join-Path $root "dist"
if (-not (Test-Path $dist)) { New-Item -ItemType Directory -Path $dist | Out-Null }

$html = Get-Content (Join-Path $root "index.html") -Raw -Encoding UTF8
$css  = Get-Content (Join-Path $root "css\styles.css") -Raw -Encoding UTF8

$jsFiles = @("config.js", "data.js", "maps.js", "osm.js", "app.js")
$js = ($jsFiles | ForEach-Object {
  "/* ---- js/$_ ---- */`r`n" + (Get-Content (Join-Path $root "js\$_") -Raw -Encoding UTF8)
}) -join "`r`n"

$html = $html -replace '<link rel="stylesheet" href="css/styles\.css">', "<style>`r`n$css`r`n</style>"
foreach ($f in $jsFiles) {
  $html = $html -replace "<script src=""js/$([regex]::Escape($f))""></script>", ""
}
$html = $html -replace '(?s)</body>', "<script>`r`n$js`r`n</script>`r`n</body>"

$out = Join-Path $dist "foodradar.html"
[System.IO.File]::WriteAllText($out, $html, (New-Object System.Text.UTF8Encoding($false)))
"OK -> $out  ({0:N0} KB)" -f ((Get-Item $out).Length / 1KB)
