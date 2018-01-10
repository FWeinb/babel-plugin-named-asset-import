import { transform } from 'babel-core'
import pluginTester from 'babel-plugin-tester'
import plugin from '../'


it('should add import to webpack loaders', () => {
    const input = `
        import { ReactComponent, url } from 'icon.svg'
    `
    const { code } = transform(input, { plugins: [plugin] });
    expect(code).toMatchSnapshot();
});

it('should throw if there was an invalid asset name', () => {
    const input = `
    import { thisIsNotExported } from 'icon.svg'
    `
    expect(() => {
        const { code } = transform(input, { plugins: [plugin] });
    }).toThrow(/url, raw, ReactComponent/);
})

it('should retained renamed import', () => {
    const input = `
        import { ReactComponent as Icon } from 'icon.svg'
    `
    const { code } = transform(input, { plugins: [plugin] });
    expect(code).toMatchSnapshot();
});

it('should leave default import intact for now', () => {
    const input = `
        import Test from 'icon.svg'
    `
    const { code } = transform(input, { plugins: [plugin] });
    expect(code).toMatchSnapshot();
});

it('modules and js files should not be changed', () => {
    const input = `
        import { url, other, key } from 'some-module'
        import { test } from './file.js'
    `
    const { code } = transform(input, { plugins: [plugin] });
    expect(code).toMatchSnapshot();
});