import { extname } from 'path';
import { wrapErrorWithCodeFrame, createErrorWithLoc } from 'babel-errors';

const extensions = ['png', 'svg', 'md', 'html'];
const validExtension = ext => extensions.some(validExt => ext === validExt);

const wasProcessed = path => path.node.source.value.indexOf('!') !== -1;
const formatAssetNames = loaders => Object.keys(loaders).join(', ');

const defaultLoaders = {
    url: 'url-loader',
    raw: 'file-loader'
}

const assetLoaderMap = {
    svg: {
        ReactComponent: 'svg-react-loader'
    },
    md: {
        html: 'html-loader!markdown-loader'
    },
    html: {
        html: 'html-loader'
    }
}

export default ({ types: t }) => ({
    visitor: {
        ImportDeclaration(path) {
            if (wasProcessed(path)) return;

            const sourcePath = path.node.source.value;
            const ext = extname(sourcePath).substr(1);

            if (!validExtension(ext)) return;

            const loaders = Object.assign({}, defaultLoaders, assetLoaderMap[ext]);

            path.replaceWithMultiple(path.node.specifiers
                .map(specifier => {
                    if (t.isImportDefaultSpecifier(specifier)) return path.node;


                    const localName = specifier.local.name;
                    const assetName = specifier.imported.name;

                    const loader = loaders[assetName];

                    if (loader === undefined) {
                        throw path.hub.file.buildCodeFrameError(specifier, "Unkown asset requested, possible assets are: " + formatAssetNames(loaders))
                    }

                    return t.importDeclaration(
                        [t.importDefaultSpecifier(t.identifier(localName))],
                        t.stringLiteral(loader + "!" + sourcePath)
                    )
                })
            );
        }
    }
});
