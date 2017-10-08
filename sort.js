function test(array, i, j) {
  self.postMessage(['test', i, j]);

  return array[i] - array[j];
}

function swap(array, i, j) {
  self.postMessage(['swap', i, j]);

  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

function bubbleSort(a) {
  var n = a.length;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n - i - 1; j++) {
      if (test(a, j + 1, j) < 0) {
        swap(a, j, j + 1);
      }
    }
  }
}


function cocktailSort(a) {
  var n = a.length;
  var left = 0;
  var right = n - 1;
  while (left < right) {
    var new_right = right - 1;
    for (var i = left; i + 1 <= right; i++) {
      if (test(a, i + 1, i) > 0) {
        swap(a, i + 1, i);
        new_right = i;
      }
    }
    right = new_right;
    var new_left = left + 1;
    for (var i = right; i - 1 >= left; i--)  {
      if (test(a, i, i - 1) > 0) {
        swap(a, i, i - 1);
        new_left = i;
      }
    }
    left = new_left;
  }
}

// Adapted from http://blog.mgechev.com/2012/11/24/javascript-sorting-performance-quicksort-v8/
function heapSort(array) {
  function heapify(array, index, heapSize) {
    var left = 2 * index + 1;
    var right = 2 * index + 2;
    var largest = index;
    if (left < heapSize && test(array, left, index) > 0) {
      largest = left;
    }
    if (right < heapSize && test(array, right, largest) > 0) {
      largest = right;
    }
    if (largest !== index) {
      swap(array, index, largest);
      heapify(array, largest, heapSize);
    }
  }

  function buildMaxHeap(array) {
    for (var i = Math.floor(array.length / 2); i >= 0; i -= 1) {
      heapify(array, i, array.length);
    }
    return array;
  }

  var size = array.length;
  var temp;
  buildMaxHeap(array);
  for (var i = array.length - 1; i > 0; i -= 1) {
    swap(array, 0, i);
    size -= 1;
    heapify(array, 0, size);
  }
}

function insertionSort(a) {
  var n = a.length;
  for (var i = 1; i < n; i++) {
    for (var j = i; j > 0 && test(a, j, j - 1) < 0; j--) {
      swap(a, j, j - 1);
    }
  }
}

function oddEvenSort(a) {
  var n = a.length;
  var sorted = false;
  while (!sorted) {
    sorted = true;
    for (var p = 0; p <= 1; p++) {
      for (var i = p; i + 1 < n; i += 2) {
        if (test(a, i + 1, i) < 0) {
          swap(a, i + 1, i);
          sorted = false;
        }
      }
    }
  }
}

// Adapted from https://www.nczonline.net/blog/2012/11/27/computer-science-in-javascript-quicksort/
function quickSort(arr) {
  function quickSort(arr, left, right) {
    var len = arr.length;
    var pivot;
    var partitionIndex;
    if (left < right) {
      pivot = right;
      partitionIndex = partition(arr, pivot, left, right);

      quickSort(arr, left, partitionIndex - 1);
      quickSort(arr, partitionIndex + 1, right);
    }
    return arr;
  }

  function partition(arr, pivot, left, right) {
    var partitionIndex = left;
    for (var i = left; i < right; i++) {
      if (test(arr, i, pivot) < 0) {
        swap(arr, i, partitionIndex);
        partitionIndex++;
      }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
  }

  quickSort(arr, 0, arr.length - 1);
}

function selectionSort(a) {
  var n = a.length;
  for (var i = 0; i < n - 1; i++) {
    var k = i;
    for (var j = i; j < n; j++) {
      if (test(a, j, k) < 0) {
        k = j;
      }
    }

    swap(a, i, k);
  }
}

// Adapted from https://stackoverflow.com/q/29501448/623816
var shellSort = function (array) {
  var length = array.length;
  var h = 1;
  while (h < length / 3) {
    h = 3 * h + 1;
  }
  while (h > 0) {
    for (var i = h; i < length; i++) {
      for (var j = i; j > 0 && array[j] < array[j - h]; j -= h) {
        // TODO: Find out, why using "test(array, j, j - h) < 0"
        // above does not finish the visualisation correctly.
        self.postMessage(['test', j, j - h]);
        swap(array, j, j - h);
      }
    }
    h = --h / 3;
  }
  return array;
}

self.onmessage = function(event) {
  var sort = eval(event.data[0]);
  sort(event.data[1], 'middle');

  console.log(event.data[1]);
};
