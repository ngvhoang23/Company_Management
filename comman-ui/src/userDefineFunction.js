import axios from 'axios';

function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}

const getExtension = (filename) => {
    var parts = filename?.split('.');
    return parts[parts.length - 1];
};

const handleDownLoadFile = (url, file_name) => {
    if (!url || !file_name) {
        return;
    }
    axios.get(url, { responseType: 'blob' }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file_name);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    });
};

export { getPosition, getExtension, handleDownLoadFile };
