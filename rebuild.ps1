$cssPath = "c:\Users\ingri\OneDrive\Documentos\Proyecto pagina eterno\styles.css"
$missingPath = "c:\Users\ingri\OneDrive\Documentos\Proyecto pagina eterno\missing.css"

$bytes = [IO.File]::ReadAllBytes($cssPath)
$cleanBytes = [System.Collections.Generic.List[byte]]::new()
$bomFixed = $false

for ($i=0; $i -lt $bytes.Length; $i++) {
    if ($bytes[$i] -eq 0) { continue }
    
    # Check for FF FE
    if ($bytes[$i] -eq 255 -and $i+1 -lt $bytes.Length -and $bytes[$i+1] -eq 254) {
        $i++
        continue
    }
    
    $cleanBytes.Add($bytes[$i])
}

$cleanText = [System.Text.Encoding]::UTF8.GetString($cleanBytes.ToArray())

# Find the valid end
$endMarker = "text-transform: uppercase;`n}"
$endMarker2 = "text-transform: uppercase;`r`n}"
$idx = $cleanText.LastIndexOf("text-transform: uppercase;")
if ($idx -gt 0) {
    # Cut string up to the `}`
    $idxEnd = $cleanText.IndexOf("}", $idx)
    if ($idxEnd -gt 0) {
        $cleanText = $cleanText.Substring(0, $idxEnd + 1)
    }
}

$missingText = [IO.File]::ReadAllText($missingPath)
$finalText = $cleanText + "`n`n" + $missingText

[IO.File]::WriteAllText($cssPath, $finalText, [System.Text.Encoding]::UTF8)
Write-Host "Styles.css rebuilt successfully!"
