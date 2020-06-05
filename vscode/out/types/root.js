"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabsType = exports.TabType = exports.CollectionsType = exports.CollectionType = exports.StdOutType = exports.ImportStatusType = exports.ImporterResultType = exports.DocsIndexType = exports.DocsEntryType = exports.DirectoriesType = exports.SearchViewType = exports.HTMLViewType = exports.PluginViewType = exports.ImportViewType = exports.ViewType = void 0;
var ViewType;
(function (ViewType) {
    ViewType["plugin"] = "plugin";
    ViewType["html"] = "html";
    ViewType["search"] = "search";
    ViewType["importer"] = "importer";
})(ViewType = exports.ViewType || (exports.ViewType = {}));
class ImportViewType {
}
exports.ImportViewType = ImportViewType;
class ContentViewBase {
}
class PluginViewType extends ContentViewBase {
}
exports.PluginViewType = PluginViewType;
class HTMLViewType extends ContentViewBase {
}
exports.HTMLViewType = HTMLViewType;
class SearchViewType {
}
exports.SearchViewType = SearchViewType;
class DirectoriesType {
}
exports.DirectoriesType = DirectoriesType;
class DocsEntryType {
}
exports.DocsEntryType = DocsEntryType;
class DocsIndexType {
}
exports.DocsIndexType = DocsIndexType;
class ImporterResultType {
}
exports.ImporterResultType = ImporterResultType;
var ImportStatusType;
(function (ImportStatusType) {
    ImportStatusType["loading"] = "loading";
    ImportStatusType["error"] = "error";
    ImportStatusType["imported"] = "imported";
})(ImportStatusType = exports.ImportStatusType || (exports.ImportStatusType = {}));
class StdOutType {
}
exports.StdOutType = StdOutType;
class CollectionType {
}
exports.CollectionType = CollectionType;
class CollectionsType {
}
exports.CollectionsType = CollectionsType;
class TabType {
}
exports.TabType = TabType;
class TabsType {
}
exports.TabsType = TabsType;
//# sourceMappingURL=root.js.map