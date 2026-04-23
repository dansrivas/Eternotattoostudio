$files = @("index.html", "styles.css")
foreach ($f in $files) {
    $path = Resolve-Path $f
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    
    # Correcting the double-encoding
    # String "Ã³" -> bytes [0xC3, 0xB3] (via ISO-8859-1) -> string "ó" (via UTF-8)
    $iso = [System.Text.Encoding]::GetEncoding("iso-8859-1")
    $bytes = $iso.GetBytes($content)
    $fixedContent = [System.Text.Encoding]::UTF8.GetString($bytes)
    
    [System.IO.File]::WriteAllText($path, $fixedContent, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Fixed $f"
}
