function checkDuplicateElementForStaff(data) {
    const seen = new Set();
    for (const sublist of data) {
        for (const element of sublist) {
            const elementId = element._id;
            if (seen.has(elementId)) {
                return element;
            }
            seen.add(elementId);
        }
    }
    return null;
}

function findDuplicateElementForCustomer(data) {
    const seenIds = new Set();

    for (const innerArray of data) {
        for (const element of innerArray) {
            const elementId = element._id.toString(); // Convert ObjectId to string for comparison
            if (seenIds.has(elementId)) {
                return element;
            }
            seenIds.add(elementId);
        }
    }

    return null;
}

function findDuplicateQuantity(data) {
    const idCounts = new Map();

    for (const item of data) {
        const itemId = item._id.toString();

        if (idCounts.has(itemId)) {
            idCounts.set(itemId, idCounts.get(itemId) + 1);
        } else {
            idCounts.set(itemId, 1);
        }
    }

    let duplicateQuantity = 0;
    idCounts.forEach((count) => {
        if (count > 1) {
            duplicateQuantity += count;
        }
    });

    return duplicateQuantity
}

function findDuplicatesForProduct(data) {
    const uniqueItems = [];
    const seenIds = new Set();

    for (const item of data) {
        const itemId = item._id.toString();

        if (!seenIds.has(itemId)) {
            uniqueItems.push(item);
            seenIds.add(itemId);
        }
    }

    return uniqueItems;
}

export {checkDuplicateElementForStaff, findDuplicateElementForCustomer, findDuplicateQuantity, findDuplicatesForProduct}