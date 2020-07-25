call activate pytorch
powershell -Command "(gc resources\misc\mmsr\codes\options\test\test_ESRGAN.yml) -replace 'directory', '%cd%\resources\' | Out-File -encoding ASCII resources\misc\mmsr\codes\options\test\test_ESRGAN.yml"
cd resources/misc/mmsr/codes
python test.py -opt options/test/test_ESRGAN.yml
