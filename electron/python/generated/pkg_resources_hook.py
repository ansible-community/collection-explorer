# Runtime hook generated from spec file to support pkg_resources entrypoints.
ep_packages = {'markdown.extensions': ['abbr = markdown.extensions.abbr:AbbrExtension', 'admonition = markdown.extensions.admonition:AdmonitionExtension', 'attr_list = markdown.extensions.attr_list:AttrListExtension', 'codehilite = markdown.extensions.codehilite:CodeHiliteExtension', 'def_list = markdown.extensions.def_list:DefListExtension', 'extra = markdown.extensions.extra:ExtraExtension', 'fenced_code = markdown.extensions.fenced_code:FencedCodeExtension', 'footnotes = markdown.extensions.footnotes:FootnoteExtension', 'legacy_attrs = markdown.extensions.legacy_attrs:LegacyAttrExtension', 'legacy_em = markdown.extensions.legacy_em:LegacyEmExtension', 'meta = markdown.extensions.meta:MetaExtension', 'nl2br = markdown.extensions.nl2br:Nl2BrExtension', 'sane_lists = markdown.extensions.sane_lists:SaneListExtension', 'smarty = markdown.extensions.smarty:SmartyExtension', 'tables = markdown.extensions.tables:TableExtension', 'toc = markdown.extensions.toc:TocExtension', 'wikilinks = markdown.extensions.wikilinks:WikiLinkExtension']}

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
