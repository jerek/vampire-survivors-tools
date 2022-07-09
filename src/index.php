<?php

// ********************* //
// ***** FUNCTIONS ***** //
// ********************* //

/**
 * Returns the given string escaped for use in an HTML attribute.
 *
 * @param string $string
 * @return string
 */
function escHtmlAttr(string $string): string {
    return htmlspecialchars($string, ENT_QUOTES | ENT_HTML5);
}

/**
 * Returns the full path of the given file, with a query string added to the end for cache busting.
 *
 * @param string $file The file path without the primary dir or file extension.
 * @param string $type 'js' or 'css'
 * @return string
 * @throws UnexpectedValueException
 */
function getFilePath(string $file, string $type): string {
    switch ($type) {
        case 'css':
        case 'js':
            $path = "/$type/$file.$type";
            break;
        default:
            throw new UnexpectedValueException('Tried to generate a file path for an unsupported type.');
    }

    if ($file === 'VST/Analytics') {
        // uBlock Origin will block this file if it has a query string, so just return the raw path to avoid JS errors.
        return $path;
    }

    // The git commit hash is appended to file paths for cache busting.
    return "$path?" . getGlobalCommitHash();
}

/**
 * Returns the commit hash of the given JS or CSS file.
 *
 * TODO: Cache this information somehow, so that it can be used without noticeably slowing the page load time.
 *
 * @param string  $filePath
 * @return string
 * @throws UnexpectedValueException|RuntimeException
 */
function getCommitHash(string $filePath): string {
    if (strpos($filePath, '..') !== false) {
        throw new UnexpectedValueException('Paths are not allowed to escape the specified directory.');
    }

    if (strpos($filePath, '/js/') !== 0 && strpos($filePath, '/css/') !== 0) {
        throw new UnexpectedValueException('Paths may only reference files in the JS or CSS directories.');
    }

    $jsInternalPath = __DIR__ . $filePath;
    if (!file_exists($jsInternalPath)) {
        throw new RuntimeException('File not found.');
    }

    return exec("git log --pretty=\"%h\" -n1 HEAD $jsInternalPath");
}

/**
 * Returns the current commit hash of the project.
 *
 * @return string
 */
function getGlobalCommitHash(): string {
    static $hash = null;

    return $hash ??= exec('git log --pretty="%h" -n1 HEAD');
}

// **************** //
// ***** HTML ***** //
// **************** //

// ======== //
// JS FILES //
// ======== //

// These are generally ordered starting with the most fundamental classes, so that their class aliases work.
$jsFiles = [
    'VST',
    'VST/Util',
    'VST/DOM',
    'VST/VS',
    'VST/VS/Img',
    'VST/VS/Arcana',
    'VST/VS/Character',
    'VST/VS/Passive',
    'VST/VS/Stage',
    'VST/VS/Weapon',
    'VST/VS/Item', // Requires weapons and passive items to initialize first.
    'VST/Analytics',
    'VST/Page',
    'VST/Build',
    'VST/Build/Hash',
];

// ========= //
// CSS FILES //
// ========= //

$cssFiles = [
    'VST',
];

// ====== //
// OUTPUT //
// ====== //

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1">
    <title>Vampire Survivors Tools</title>
<?php foreach ($jsFiles as $jsFile) { ?>
    <script src="<?=escHtmlAttr(getFilePath($jsFile, 'js'))?>"></script>
<?php }
foreach ($cssFiles as $cssFile) { ?>
    <link rel="stylesheet" type="text/css" href="<?=escHtmlAttr(getFilePath($cssFile, 'css'))?>">
<?php } ?>
    <link rel="icon" type="image/png" href="/favicon.png">
</head>
<body></body>
</html>
