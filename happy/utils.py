from .models import UserHappinessData

def getUserHappinessDataVerboseNamesDict():
    indicator_names = UserHappinessData._meta.get_fields()
    name_verbosename = {}
    for indicator_name in indicator_names:
        name_verbosename[indicator_name.name] = indicator_name.verbose_name
    
    return name_verbosename

def getAverageDict(sets):
    num_sets = len(sets)
    if num_sets>0:
        dict_keys=list(sets[0].keys()) 

        average_dict = {} 
        
        for i in range(len(dict_keys)):
            average_dict[dict_keys[i]] = 0

        for i in range(num_sets):
            _set = sets[i]
            for value in _set:
                average_dict[value] += _set[value]

        for value in average_dict:
            average_dict[value] = (average_dict[value]) / num_sets

        return average_dict
    
    else:
        return {}