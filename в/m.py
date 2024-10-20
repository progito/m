# Найти сумму всех нечетных элементов в списке.
lst = [1, 3, 4, 5, 5, 6, 2]

summa = 0   
for i in range(len(lst)):
    if lst[i] % 2 != 0:
        summa += lst[i]
print(summa)
