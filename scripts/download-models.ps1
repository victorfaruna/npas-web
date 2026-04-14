# download-models.ps1
# Downloads face-api.js model weight files from GitHub into public/models/
# Run once from the project root: .\scripts\download-models.ps1

$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
$dest = ".\public\models"

if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest | Out-Null
    Write-Host "Created $dest" -ForegroundColor Green
}

$files = @(
    "ssd_mobilenetv1_model-weights_manifest.json",
    "ssd_mobilenetv1_model-shard1",
    "ssd_mobilenetv1_model-shard2",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_recognition_model-shard2",
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1"
)

$total = $files.Count
$i = 0

foreach ($file in $files) {
    $i++
    $url = "$baseUrl/$file"
    $outFile = "$dest\$file"

    if (Test-Path $outFile) {
        Write-Host "[$i/$total] Already exists: $file" -ForegroundColor DarkGray
        continue
    }

    Write-Host "[$i/$total] Downloading: $file" -ForegroundColor Cyan
    try {
        Invoke-WebRequest -Uri $url -OutFile $outFile -UseBasicParsing -ErrorAction Stop
        Write-Host "  Done" -ForegroundColor Green
    } catch {
        Write-Host "  Failed: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "All models downloaded to $dest" -ForegroundColor Green
Write-Host "You can now run: npm run dev" -ForegroundColor Yellow
