source venv/bin/activate

pip install -r requirements.txt

echo "Building anible-doc"
pyinstaller -y ansible-doc.spec

echo ""
echo "Building galaxy importer"
pyinstaller -y importer_wrapper.spec

echo ""
echo "Building ansible lint"
pyinstaller -y ansible-lint.spec
