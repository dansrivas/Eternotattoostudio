$f = Resolve-Path "index.html"
$content = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# Fix Diamonds
$content = $content -replace '<span class="diamond[^>]*>.*?</span>', {
    param($match)
    return $match.Value -replace '(?<=>).*?(?=</span>)', '◆'
}

# Fix known corrupted titles and strings (based on screenshot and common patterns)
$replacements = @{
    'Â¿QUÂ© ES UN FLASH\?' = '¿QUÉ ES UN FLASH?'
    'TRILOGÂÃ DE LÃÃNEA'   = 'TRILOGÍA DE LÍNEA'
    'LÃÃNEA'               = 'LÍNEA'
    'Â¿QUÃ© ES UN FLASH\?' = '¿QUÉ ES UN FLASH?'
    'TrilogÃa de LÃnea'  = 'Trilogía de Línea'
    'LÃnea'                = 'Línea'
    'â—†'                  = '◆'
    'Â—†'                  = '◆'
}

foreach ($key in $replacements.Keys) {
    $content = $content -replace $key, $replacements[$key]
}

[System.IO.File]::WriteAllText($f, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "Fixed index.html diamond and titles."
