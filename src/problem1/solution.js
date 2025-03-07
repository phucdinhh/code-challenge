// Using for loop
var sum_to_n_a = function (n) {
  let sum = 0;
  let i = 1;
  for (i; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// Using formula
var sum_to_n_b = function (n) {
  return (n * (n + 1)) / 2;
};

// Using recursion
var sum_to_n_c = function (n) {
  if (n === 1) return 1;
  return n + sum_to_n_c(n - 1);
};
