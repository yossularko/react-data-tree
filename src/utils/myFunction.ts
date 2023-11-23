const recursiveDataTree = <T, D>(
  dataChild: any[],
  dataParent: any[],
  selectField: keyof D,
  idField: keyof D
): T[] => {
  return dataChild.map((item) => {
    const child = dataParent.filter(
      (val) => val[selectField] === item[idField]
    );

    if (child.length === 0) {
      return item;
    }

    return {
      ...item,
      children: recursiveDataTree(child, dataParent, selectField, idField),
    };
  });
};

const checkDuplicateArr = (input_array: (number | string)[]) => {
  const duplicates = input_array.filter(
    (item, index) => input_array.indexOf(item) !== index
  );
  return Array.from(new Set(duplicates));
};

const generateDataTree = <T, D>(
  data: any[],
  selectField: keyof D, // parent_id
  idField: keyof D // id
): T[] => {
  if (data.length === 0) {
    return [];
  }

  const checkDuplicate = checkDuplicateArr(data.map((val) => val[idField]));

  if (checkDuplicate.length > 0) {
    console.log(
      "cannot process data tree, there is found duplicate keys: ",
      checkDuplicate
    );
    return [];
  }

  const newData = data.map((val) => {
    if (val[selectField] === val[idField]) {
      return { ...val, [val[selectField]]: null };
    }

    return val;
  });

  const idDataList = newData.map((val) => val[idField]);

  const validData = newData.map((val) => {
    const isValidParent = idDataList.some((item) => item === val[selectField]);
    if (isValidParent) {
      return val;
    }

    if (val[selectField] === null) {
      return val;
    }

    console.log(
      `id #${val[idField]} is unknown parent_id #${val[selectField]}`
    );
    return { ...val, [val[selectField]]: null, unknowParent: val[selectField] };
  });

  const reduced = validData
    .filter((item) => item[selectField] === null)
    .reduce((acc, curr) => {
      const children = validData.filter(
        (dataFilter) => dataFilter[selectField] === curr[idField]
      );

      if (children.length === 0) {
        acc.push(curr);
      } else {
        acc.push({
          ...curr,
          children: recursiveDataTree(
            children,
            validData,
            selectField,
            idField
          ),
        });
      }

      return acc;
    }, []);

  return reduced;
};

const generateDataFlat = (dataArr: any[]) => {
  return dataArr.reduce((acc, curr) => {
    const { children, ...rest } = curr;
    if (children) {
      const next = generateDataFlat(children);
      acc.push(rest, ...next);
    } else {
      acc.push(curr);
    }

    return acc;
  }, [] as any[]);
};

export { generateDataTree, generateDataFlat };
