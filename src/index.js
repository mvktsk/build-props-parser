const xml2js = require('xml2js');
const fs = require('fs');

const directoryBuildPropsPath = "./src/Directory.Build.props";

function isVersion (element, index, array)
{
    return element.hasOwnProperty(this.attributeName);
}

function getInfoFromDirectoryBuildProps(path)
{
    return new Promise((resolve) => {
        let buildPropsFile = path;
    
        if (fs.existsSync(buildPropsFile)) {
            let propsFileContent = fs.readFileSync(buildPropsFile); 
            xml2js.parseString(propsFileContent, function (err, json) {
                if (!err) {
                    const propertyGroup = json.Project.PropertyGroup;
                    const versionPrefix = propertyGroup.find(isVersion, {attributeName: "VersionPrefix"});
                    const versionSuffix = propertyGroup.find(isVersion, {attributeName: "VersionSuffix"});
                    var prefix = versionPrefix?.VersionPrefix[0].trim();
                    var suffix = versionSuffix?.VersionSuffix[0].trim();

                    let version = [];
                    version.push(prefix);
                    if(suffix) version.push(suffix);
                    var result = {
                        prefix: prefix,
                        suffix: suffix,
                        version: version.join("-")
                    }
                    resolve(result);
                } else {
                    console.log(err.message);
                }
            });
        }
    });
}

const directoryBuildProps = getInfoFromDirectoryBuildProps(directoryBuildPropsPath);
console.log(directoryBuildProps);