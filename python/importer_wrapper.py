import sys
import json
import attr
import os

from galaxy_importer import collection


def main():
    filepath = sys.argv[1]

    # Modified importer to importer directory instead of tarball
    data = collection.CollectionLoader(filepath, filepath).load()

    # probably shouldn't cache the importer in the collection dir since we may
    # not have write access to it
    json_data = json.dumps(attr.asdict(data), indent=2)

    with open(os.path.join(filepath, '_collection_explorer_cache.json'), 'w+') as output_file:
        output_file.write(json_data)

    print (json_data)


main()
