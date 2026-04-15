$content = Get-Content index.html
$newContent = @()
foreach ($line in $content) {
    if ($line -match '<img id="gc-bg-image" src="data:image/jpeg;base64,') {
        $newContent += '          <img id="gc-bg-image" src="tarjeta_definitiva.png" alt="Gift Card Background" style="width:100%; height:auto; display:block; border-radius:12px; border: 1px solid rgba(255,255,255,0.1);">'
    } else {
        $newContent += $line
    }
}
$newContent | Set-Content index.html
