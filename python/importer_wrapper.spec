# -*- mode: python ; coding: utf-8 -*-

block_cipher = None


import pkg_resources
import os

hook_ep_packages = dict()
hiddenimports = set()

# List of packages that should have there Distutils entrypoints included.
ep_packages = ["markdown.extensions"]

if ep_packages:
    for ep_package in ep_packages:
        for ep in pkg_resources.iter_entry_points(ep_package):
            if ep_package in hook_ep_packages:
                package_entry_point = hook_ep_packages[ep_package]
            else:
                package_entry_point = []
                hook_ep_packages[ep_package] = package_entry_point
            package_entry_point.append("{} = {}:{}".format(ep.name, ep.module_name, ep.attrs[0]))
            hiddenimports.add(ep.module_name)

    try:
        os.mkdir('./generated')
    except FileExistsError:
        pass

    with open("./generated/pkg_resources_hook.py", "w") as f:
        f.write("""# Runtime hook generated from spec file to support pkg_resources entrypoints.
ep_packages = {}

if ep_packages:
    import pkg_resources
    default_iter_entry_points = pkg_resources.iter_entry_points

    def hook_iter_entry_points(group, name=None):
        if group in ep_packages and ep_packages[group]:
            eps = ep_packages[group]
            for ep in eps:
                if name and not ep.startswith(name):
                    continue
                parsedEp = pkg_resources.EntryPoint.parse(ep)
                parsedEp.dist = pkg_resources.Distribution()
                yield parsedEp
        else:
            return default_iter_entry_points(group, name)

    pkg_resources.iter_entry_points = hook_iter_entry_points
""".format(hook_ep_packages))


a = Analysis(['importer_wrapper.py'],
             pathex=['/Users/dnewswan/code/collection-explorer/python'],
             binaries=[],
             datas=[('venv/lib/python3.7/site-packages/galaxy_importer/utils/spdx_licenses.json', 'galaxy_importer/utils/')],
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=["./generated/pkg_resources_hook.py"],
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
          name='importer_wrapper',
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
               name='importer_wrapper')
