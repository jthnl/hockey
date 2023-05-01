// Force item with itemId's aspect ratio to stay constant
const updateItemSizeAspectRatio = (itemId, aspectRatio, setWidth, setHeight) => {
    const container = document.getElementById(itemId);
    if (container != null) {
        const newHeight = container.clientHeight;
        const newWidth = newHeight / aspectRatio;

        setWidth(newWidth);
        setHeight(newHeight);
    }
};

export default updateItemSizeAspectRatio;
