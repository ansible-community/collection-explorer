# -*- mode: python ; coding: utf-8 -*-

block_cipher = None


a = Analysis(['venv/bin/ansible-doc'],
             pathex=['/Users/dnewswan/code/collection-explorer'],
             binaries=[],
             datas=[('venv/lib/python3.7/site-packages/ansible/config/base.yml', 'ansible/config/'), ('venv/lib/python3.7/site-packages/ansible/config/module_defaults.yml', 'ansible/config/')],
             hiddenimports=['ansible.cli', 'ansible.cli.doc', 'ansible.modules', 'configparser'],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          [],
          exclude_binaries=True,
          name='ansible-doc',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               upx_exclude=[],
               name='ansible-doc')
