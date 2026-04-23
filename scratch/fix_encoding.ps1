$filepath = "c:\Users\ingri\OneDrive\Documentos\Proyecto pagina eterno\index.html"
$content = Get-Content -Path $filepath -Raw -Encoding UTF8

$content = $content.Replace("CuliacÃ¡n", "Culiacán")
$content = $content.Replace("â€”", "—")
$content = $content.Replace("Â¡", "¡")
$content = $content.Replace("HIDRATACI`"N", "HIDRATACIÓN")
$content = $content.Replace("ENCU?NTRANOS AQUÍ", "ENCUÉNTRANOS AQUÍ")
$content = $content.Replace("C`"MO LLEGAR", "CÓMO LLEGAR")
$content = $content.Replace("DISE'O", "DISEÑO")
$content = $content.Replace("? DESCARGAR TARJETA", "⬇️ DESCARGAR TARJETA")

$injection1 = @"
    param(`$match)
    return `$match.Value -replace '(?<=>).*?(?=</span>)', 'â—†'
 ESPECIALES ETERNO
"@
$content = $content.Replace($injection1, '<span class="diamond">◆</span> ESPECIALES Y PROMOCIONES')

$injection2 = @"
    param(`$match)
    return `$match.Value -replace '(?<=>).*?(?=</span>)', 'â—†'
 CONTACTO
"@
$content = $content.Replace($injection2, '<span class="diamond">◆</span> CONTACTO')

# Some fallbacks in case line endings vary:
$injection1_rnc = "    param(`$match)`r`n    return `$match.Value -replace '(?<=>).*?(?=</span>)', 'â—†'`r`n ESPECIALES ETERNO"
$content = $content.Replace($injection1_rnc, '<span class="diamond">◆</span> ESPECIALES Y PROMOCIONES')

$injection1_n = "    param(`$match)`n    return `$match.Value -replace '(?<=>).*?(?=</span>)', 'â—†'`n ESPECIALES ETERNO"
$content = $content.Replace($injection1_n, '<span class="diamond">◆</span> ESPECIALES Y PROMOCIONES')

$injection2_rnc = "    param(`$match)`r`n    return `$match.Value -replace '(?<=>).*?(?=</span>)', 'â—†'`r`n CONTACTO"
$content = $content.Replace($injection2_rnc, '<span class="diamond">◆</span> CONTACTO')

$injection2_n = "    param(`$match)`n    return `$match.Value -replace '(?<=>).*?(?=</span>)', 'â—†'`n CONTACTO"
$content = $content.Replace($injection2_n, '<span class="diamond">◆</span> CONTACTO')


Set-Content -Path $filepath -Value $content -Encoding UTF8
Write-Output "Done replacing text."
