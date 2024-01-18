from pandas import *

csv_path="data-es.csv"
data = read_csv(csv_path, sep=';')

#print(data)

# Convertir le DataFrame en un tableau NumPy
data_array = data.values

"""
# Maintenant, vous pouvez accéder aux lignes et aux colonnes comme vous le feriez avec un tableau NumPy
for row in data_array:
    print(row)
"""

nb_false=0
nb_true=0

# Par exemple, pour accéder à la deuxième colonne (indice 1) de toutes les lignes :
for row in data_array:
    if row[29]==True:
        nb_true+=1
        print(row[1],",",row[2],",",row[4],",",row[3],", Coordonnées WGS84 : Longitude=",row[26],",Latitude=",row[27],",Accès libre :",row[29])
    else:
        nb_false+=1

print("False=",nb_false,", True=",nb_true)
