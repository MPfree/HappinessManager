import pandas as pd 
import numpy as np 
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.feature_selection import SelectFromModel
from sklearn.feature_selection import RFE
import seaborn as sns

def LogReg(Sleep, Exercise, Social, Metime, Weather, SocialMedia):

    entries = [Sleep, Exercise, Social, Metime, Weather, SocialMedia]
    keys = ['Sleep', 'Exercise', 'Social', 'Metime', 'Weather', 'SocialMedia']

    ## Importing CSV into Pandas dataframe
    data = pd.read_csv('data.csv')

    ## Removing unwanted features from data
    remove = []
    for i in range(len(entries)):
        if entries[i] != 1:
            remove += [keys[i]]

    data = data.drop(remove, axis=1)

    ## Converting data into Numpy arrays
    x = (np.array(data.values.tolist()))[:, :-1]
    y = np.array(data['Happy'].tolist())

    ## Splitting Data to Train and Test Sets 
    X_train, X_test, y_train, y_test = train_test_split(x, y, train_size = 0.8, test_size=0.2, random_state=15)
    
    ## Training the model
    log_reg = LogisticRegression(random_state=10, solver = 'lbfgs')
    log_reg.fit(X_train, y_train)

    log_reg.predict(X_train)
    y_pred = log_reg.predict(X_train)

    print(log_reg.coef_[0])

    pred_proba = log_reg.predict_proba(X_train)

    print("The Training Accuracy is: ", log_reg.score(X_train, y_train))
    print("The Testing Accuracy is: ", log_reg.score(X_test, y_test))

    ## Feature Selection

    # Method 1
    predictors = X_train
    selector = RFE(log_reg, n_features_to_select=1)
    selector = selector.fit(predictors, y_train)
    order = selector.ranking_
    print(order)

    '''
    smf= SelectFromModel(log_reg, threshold=-np.infty, max_features=6)
    smf.fit(X_train, y_train)
    feature_idx = smf.get_support()
    print(feature_idx)
    '''
    return True

LogReg(1, 1, 1, 1, 1, 1)
LogReg(1, 1, 0, 1, 1, 1)
LogReg(1, 1, 0, 1, 0, 1)
LogReg(1, 0, 0, 1, 0, 1)
LogReg(1, 0, 0, 1, 0, 0)
