# OKAY BUDS

so now we need to do
`routes.get('/api/accountBalance', async (req, res) => {...}`

instead of
`routes.get('/api/accountBalance', (req, res) => {...}`

## Queries
NOTICE the position of the `async` keyword

That defines our function as asynchronous, so that we can use the keyword `await`:

```
try {
  const results = await db.query('SELECT * FROM ELECTRIC_VEHICLE WHERE vehicle_id=? AND availability=1', [vehicleID]);
  if (! results.length) {
    throw new Error('Bruh');
  } 
  res.status(400).json({success: true})
} catch (error) {
  res.status(400).json({success: false})
}
```

instead of 
```
db.query('SELECT * FROM ELECTRIC_VEHICLE WHERE vehicle_id=? AND availability=1', [vehicleID], (error, results) => {
    if (error) {
      console.log(error);
      res.status(400).json({success: false});
    } else if (results.length > 0) {
	    res.status(400).json({success: true});
    } 
});
```
### NOTICE THE USE OF THE KEYWORD AWAIT ABOVE, IF YOU FORGET THAT YOU'RE FUCKED OK

## More Examples
```
const chargerResults = await db.query('INSERT INTO CHARGER SET ?', { user_id });
if (!chargerResults.affectedRows) { 
  throw new Error('Unable to insert into CHARGER during signup.'); 
}
res.status(200).json({ success: true, message: 'Success!', 'accountId': user_id, 'accountType': 'Charger' });
```
### Notice that I used .affectedRows because I think on an insert, you don't get like an array back, you get an object so checking if .length exists is weird