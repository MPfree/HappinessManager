import pandas as pd 
import numpy as np 
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.feature_selection import SelectFromModel
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_selection import RFE
import seaborn as sns

## data WILL BE A DICTIONARY

def feature_ranking(data):

    ## CHANGE THIS PART TO TAKE IN DICTIONARY AS IMPORT FOR DATA

    ## Data is going to be a dictionary with the same keys as above, pretty simple

    ## Converting data into Numpy arrays
    x = (np.array(list(data.values())))[:-1, :]
    x_length = []
    for i in range(len(x)):
        x_length.append(len(x[i]))
    x = x.transpose()
    y = np.array(list(data.get('happy')))
    y_length = len(y)

    ## Splitting Data to Train and Test Sets 
    X_train, X_test, y_train, y_test = train_test_split(x, y, train_size = 0.8, test_size=0.2, random_state=15)

    ## Training the model
    log_reg = LogisticRegression(random_state=10, solver = 'lbfgs')
    log_reg.fit(X_train, y_train)

    log_reg.predict(X_train)
    y_pred = log_reg.predict(X_train)

    ## Printing the coefficients
    #print(log_reg.coef_[0])

    ## Givin the test data, the probabilities that the given information produces a happy or unhappy day
    pred_proba = log_reg.predict_proba(X_train)
    #print(pred_proba)

    ''' 
    ## Feature Ranking - RFE Method
    predictors = X_train
    selector = RFE(log_reg, n_features_to_select=1)
    selector = selector.fit(predictors, y_train)
    order = selector.ranking_

    ranks = []
    for i in order:
        ranks.append(f"{data.columns[i-1]}")

    print("YOUR TOP INDICATORS: RFE Method")
    for j in range(0, 6):
        print(ranks[j])

    ''' 

    ## Feature Ranking - Random Forest Regressor
    rf = RandomForestRegressor()
    rf.fit(x, y)
    features = ['Sleep', 'Exercise', 'Social', 'Metime', 'Weather', 'SocialMedia']

    ranking = []
    for i in range(len(rf.feature_importances_)):
        ranking += [[rf.feature_importances_[i].round(3), features[i]]]
    ranking = sorted(ranking, key=lambda x: x[0], reverse=True)

    indicators = []
    weights = []
    for i in ranking:
        indicators += [i[1]] 
        weights += [(i[0]*100).round(4)]

    return indicators, weights
