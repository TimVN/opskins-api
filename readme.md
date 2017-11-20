

npm i opskins-api

`const OPSkins = new (require('opskins-api'))(your OPSkins API Key)`

#Categories#

 * [Cashout](#cashout-methods)
 * [Inventory](#inventory-methods)
 * [Pricing](#pricing-methods)
 * [Sales](#sales-methods)
 * [Status](#status-methods)
 * [Support](#support-methods)
 * [User](#user-methods)

# <a name='cashout-methods'>Cashout</a>

!! These methods are used accessing the 'Cashout' property !!

Example:

    OPSkins.Cashout.GetAddress('paypal').then(data => {
        
    });

<a name='GetAddress'>GetAddress(`string` processor)</a>

Input:

 * `processor` The processor you need the address for

Processor can be:

 * paypal
 * bitcoin
 * skrill
 
Output:

 * `processor_name` The name of the processor, as a string
 * `address` Your saved address, or null if not yet saved
 * `timestamp` The Unix timestamp of when you saved this address, or null if not yet saved
 * `can_change` A boolean indicating whether you can change this address by calling SetAddress again right now
 * `change_requires_twofactor` A boolean indicating whether you will need to provide a two-factor code to change this address
 
## <a name='GetPendingCashouts'>GetPendingCashouts()</a>

Output:
 
 * `cashouts` An array of objects, each of which represents a cashout and has these properties:
 * `id` The cashout ID
 * `amount` The amount to be cashed out, in USD cents
 * `address` The address to which the cashout will be sent
 * `timestamp` A Unix timestamp representing when this cashout was requested
 * `processor` The ID of the processor which this cashout will be sent via
 * `priority` A boolean indicating whether this is a priority cashout (which will incur extra fees)
 
## <a name='CancelPendingCashout'>CancelPendingCashout(`int` cashoutId)</a>

Input:

 * `cashoutid` The id of the cashout to cancel 

Outputs nothing

## <a name='GetBitcoinInstantCashoutRate'>GetBitcoinInstantCashoutRate()</a>

Output:

 * `usd_rate` The price per 1 BTC, in USD (dollars, not cents)

## <a name='RequestPayPal'>RequestPayPal(`int` amount, `int` priority)</a>

Input:

 * `amount` is in USD cents.
 * `priority` optional, 0 by default. Pass `1` if you want this to be a priority cashout (incurs extra 5% fee). Leave blank if you want a regular cashout
 
Output:

 * `address` The email address to which the cashout will be sent
 * `cashoutid` The ID of the newly-created cashout request
 * `priority` A boolean indicating whether this cashout request is for a priority cashout
 
## <a name='RequestBitcoin'>RequestBitcoin(`int` amount, `int` priority)</a>

Input:

 * `amount` is in USD cents.
 * `priority` optional, 0 by default. Pass `1` if you want this to be a priority cashout (incurs extra 5% fee). Leave blank if you want a regular cashout
 
Output:

 * `address` The Bitcoin address where this cashout will be sent
 * `cashoutid` The ID of the newly-created cashout request
 * `priority` A boolean indicating whether this cashout request is for a priority/instant cashout
 * `bitcoin_txn_id` Only present if this was an instant cashout. This is the Bitcoin transaction ID (which is a hex-string hash) which was just paid to you
 * `bitcoin_amount_satoshis` Only present if this was an instant cashout. This is the amount of BTC you received, in satoshis (0.00000001 BTC)
 
## <a name='RequestSkrill'>RequestSkrill(`int` amount)</a>

Input:

 * `amount` is in USD cents.
 
Output:

 * `address` The email address where the payment was sent
 * `cashoutid` The ID of the newly-created (and paid) cashout request
 * `skrill_txn_id` The ID of the Skrill payment transaction
 * `skrill_txn_status` An integer representing the status of the Skrill payment transaction (see Skrill's documentation)
 * `skrill_txn_status_msg` A string representing the status of the Skrill payment transaction (see Skrill's documentation)
 
## <a name='GetCashoutableBalance'>GetCashoutableBalance()</a>

Output:

 * `total_balance` Your total (spendable) account balance, in USD cents
 * `pending_cashout_balance` The sum of all your pending cashouts, in USD cents
 * `deposited_balance` How much of your balance was deposited through a payment provider, in USD cents. This amount cannot be cashed out.
 * `cashoutable_balance` The total amount of money you have that can be cashed out, in USD cents. This is your `total_balance` minus your `pending_cashout_balance` and your `deposited_balance`
 
# <a name='inventory-methods'>Inventory</a>

!! These methods are used accessing the 'Inventory' property !!

Example:

    OPSkins.Inventory.GetInventory(0).then(data => {
        console.log(data);
    });

## <a name='GetInventory'>GetInventory(`int` page, `int` per_page)</a>

Input:

 * `page` starts at 0
 * `per_page` is optional, and defaults to 10,000
 
Output:

 * `limits` An object whose keys represent an application id 
    * `730` - Steam Application ID. In this case, CS:GO. This key is dynamic and based off of which games we currently restrict inventory sizes for.
 * `free_slots` - How many slots are available in your On-Site Inventory for this game
 * `items` An array of []standard sale objects](https://opskins.com/kb/api-sale-objects), which also additionally have the following properties
    * `id_parent` The OPSkins ID of the item you purchased which created this item. For example, if you bought item #12345 and ended up with item #23456 in your OPSkins inventory, then `id` will be 23456 and `id_parent` will be 12345.
    * `added_time` The Unix timestamp for when this item was added to your OPSkins inventory
    * `offer_id` If there is an outstanding withdrawal trade offer for this item, this is its ID. If not, this is null. If you have requested a trade offer that couldn't be sent immediately but is queued to be sent in the future, this is 0.
    * `offer_declined` If there was previously a withdrawal trade offer for this item but it was declined, this is true.
    * `offer_untradable` If we previously attempted to send a withdrawal trade offer for this item but we were unable to due to a bad trade URL or another trading restriction (e.g. Steam Guard), this is true.
    * `requires_support` If this item has a problem and requires support intervention before it can be withdrawn or relisted, this is true.
    * `can_repair` If this item requires support but you can attempt to self-repair it, this is true.
    
## <a name='Withdraw'>Withdraw(`string` items)</a>

Input:

 * `items` array of item IDs. Must be items in your OPSkins inventory that do not have an outstanding trade offer and do not require support.
 
Output:

 * `offers` An array of objects (one per bot), each with the following structure:
    * `bot_id` The internal ID of the bot which sent (or tried to send) the trade offer
    * `tradeoffer_id` If we were able to successfully send a trade offer, this is its ID. If error, this is null.
    * `tradeoffer_error` If we were not able to send a trade offer, this is a string containing an error message. If no error, this is null.
    * `items` An array of OPSkins item IDs in this trade offer
    
## <a name='Deposit'>Deposit(`string` items)</a>

Add between 1 and 50 items (upper cap subject to change) to your On-Site Inventory. This will fail if any of the items passed in already have sales with active trade offers out. If there's a matching sale for an item that doesn't have a trade offer out, it will automatically be deleted. This works identically to ISales/ListItems/v1 minus the price and addons parameters.

Input:

 * `items` A JSON-encoded array of objects. One object for each item you wish to list. Each object should contain these properties:
    * `appid` The Steam AppID of the game which owns this item (e.g. 730 for CS:GO, 440 for TF2, 570 for Dota 2)
    * `contextid` The Steam context ID which contains this item (2 for Valve games, 6 for Steam Community items, 1 for H1Z1, etc.). When you right-click on an item in your Steam inventory and copy its URL, the context ID is the second number after the hash.
    * `assetid` The Steam asset ID of the item. This is also known as just the item's id
 
Output:

 * `tradeoffer_id` If a trade offer was successfully sent, this is its ID as a string. If we weren't able to send a trade offer, this is `null`
 * `tradeoffer_error` If we weren't able to send a trade offer, this is an error message string. If there was no error, this is `null`
 * `bot_id` The internal OPSkins ID of the storage account to which these sales were assigned.
 * `bot_id64` The 64-bit SteamID of the storage account to which these sales were assigned. This is the account that's sending a trade offer.
 * `security_token` The 6-character security token that is included in the trade offer message.
 * `sales` An array containing objects describing the sales that were created. Each object has these properties:
     * `saleid` The OPSkins internal ID of this sale
     * `appid` The Steam AppID for this item
     * `contextid` The Steam context ID in which this item resides in your inventory
     * `assetid` The current asset ID of this item in your inventory
     * `market_name` The name of this item
     * `price` The list price of this item in USD cents (typically set to $99,999.99)
     * `addons` An array containing strings for each addon this item has
     
# <a name='pricing-methods'>Pricing</a>

!! These methods are used accessing the 'Pricing' property !!

Example:

    OPSkins.Pricing.GetPriceList(730).then(data => {
        console.log(data);
    });
    
## <a name='GetPriceList'>GetPriceList(`int` appid)</a>

Input:

 * `appid` The Steam application ID of the app you want prices for. For example, 730 for CS:GO, 440 for TF2, or 753 for Steam.
 
Output:

`response` is an object whose keys are item names. Values of those keys are objects whose keys are dates in YYYY-MM-DD format, and the value of those keys are objects which contain several properties describing the item's sale price on that day. Prices are in USD cents (formerly known as OP). The properties are:

 * mean
 * min
 * max
 * normalized_mean
 * normalized_min
 * normalized_max
 * std_dev

The output of this method is cached by OPSkins' CDN. Therefore, the timestamp is most likely not going to be accurate. This list updates nightly at or around midnight server time (Eastern United States timezone).

## <a name='GetAllLowestListPrices'>GetAllLowestListPrices(`int` appid)</a>

Input:

 * `appid` The Steam application ID of the app you want prices for. For example, 730 for CS:GO, 440 for TF2, or 753 for Steam.
 
Output:

`response` is an object whose keys are item names. Values of those keys are objects which have the following keys:

   * `price` The lowest available list price for that item, in USD cents
   * `quantity` The total amount of that item we have on sale, for any price
   
The proper way to interpret an entry is "quantity currently on sale, starting at price".

# <a name='sales-methods'>Sales</a>

!! These methods are used accessing the 'Sales' property !!

Example:

    OPSkins.Sales.GetSales({type: 2, appid: 730).then(data => {
        console.log(data);
    });
    
## <a name='GetSales'>GetSales(`object` options)</a>

Gets a list of item sales for your account. This endpoint is paginated, and will return up to `per_page` (Default: 10,000) results per page.

Because `options` can contain a bunch of optional parameters, it is an object, pass it as such:

    {
        type: 2,
        page: 2,
        sort: 'new'
    }
    
Input:

 * `type` Optional. If provided, limit results to sales in this status. If not provided, return all sale statuses.
    1. - Awaiting pickup; you created a listing but haven't deposited the item yet. The item may also be in a trade hold or trade locked.
    2. - On sale
    3. - Sold, but not delivered to the buyer yet
    4. - Sold and delivered. You have been paid at this point.
    5. - You requested that the item be returned, but it hasn't been delivered to you yet.
    6. - The item has been returned to your account.
 * `appid` Optional. If provided, limit results to sales for this Steam AppID. If not provided, return all apps.
 * `after_saleid` Optional. If provided, limit results to sales with IDs greater than this.
 * `page` Optional. Page number to request. Defaults to 1.
 * `per_page` Optional. Number of items per page to return. Defaults to 10000. If you pass a value larger than 10,000, then it will be capped to 10,000.
 * `sort` Optional. Sorts the results by the chosen sort type. If not provided, returns results by ascending sale ID.
     * `new` - Sorts by newest created sales first.
     * `oldest_bump` - Sorts by oldest bumped sales first
     * `last_sold` - Sorts by the last sold sales first
     * `price_desc` - Sorts by highest to lowest price
     * `price_asc` - Sorts by lowest to highest price
     * `alpha` - Sorts by item names alphabetically
     * `bot` - Sorts by bot ID in ascending order
     * `activity_old` - Sorts by last_updated in ascending order
     * `activity_new` - Sorts by last_updated in descending order
 
Output:

`response` is an array of sale objects, containing these properties:

 * `id` The sale ID of the item
 * `price` The sale price of the item, in USD cents
 * `commission` If the item is sold, how much commission OPSkins took, in USD cents. If not sold, null
 * `tax` If the item is sold, how much tax was taken, in USD cents. If not sold, null
 * `classid` The Steam class ID of the item
 * `instanceid` The Steam instance ID of the item
 * `appid` The AppID of the game to which this item belongs
 * `contextid` The Steam context ID to which this item belongs
 * `assetid` If the item is currently on the bot or awaiting pickup, its Steam asset ID
 * `name` The name of the item
 * `bot` The internal ID of the bot to which this item is assigned
 * `bot_id64` The 64-bit SteamID of the bot to which this item is assigned
 * `offerid` The ID of the trade offer in which this item is being picked up or returned. null if the item is sold. There are some special values that have certain meaning.
    0. - A trade offer has been queued for this item, but hasn't been sent yet
    1. - There is no trade offer active for this item, but you could request one to be sent
    3. - We couldn't send you a trade offer because you currently can't trade. Request a trade to be sent once you can trade.
    4. - We sent you a trade offer, but you declined or countered it. You can request a new trade to be sent.
    5. - We tried to send you a trade offer, but your Trade URL was wrong or your inventory is full. You can request a new trade to be sent once you've fixed it.
    9. - There was an unknown error when we were trying to send the trade offer. You can try to [repair the sale](#RepairItem), or contact support for assistance.
    10. - When we tried to send the trade offer, Steam reported that the item no longer exists. You can try to [repair the sale](#RepairItem), or contact support for assistance.
 * `state` An integer representing what state this item is in
    1. - Awaiting pickup; you created a listing but haven't deposited the item yet. The item may also be in a trade hold or trade locked.
    2. - On sale
    3. - Sold, but not delivered to the buyer yet
    4. - Sold and delivered. You have been paid at this point.
    5. - You requested that the item be returned, but it hasn't been delivered to you yet.
    6. - The item has been returned to your account.
 * `escrow_end_date` A Unix timestamp representing when the item will come out of a Steam trade hold. If trade_locked is set, then this is the date when the item will come out of its trade lock.
 * `list_time` A Unix timestamp representing when the item was listed (or deposited, if it's been deposited)
 * `bump_time` A Unix timestamp representing when the item was last bumped
 * `last_updated` A Unix timestamp representing when the item last changed state, or had its price edited. May be 0 for older sales.
 * `security_token` The security token that the bot will send in the trade offer.
 * `wear` The item's wear, as a float. null if unknown or not applicable.
 * `txid` If the item was sold and delivered, this is the transaction ID in which you got paid.
 * `trade_locked` This will be true if the item is currently trade locked (H1Z1).
 * `repair_attempted` This will be true if the item is in an errored state, and a repair has been attempted and failed.
 * `addons` An array containing strings for addons that are applied to this item.
 * `featured` - The item has been featured
 * `private` - The item has been listed privately
 * `screenshots` - The item has an Instant Field Inspection
 
## <a name='GetListingLimit'>GetListingLimit()</a>

Get the current limit of how many items you can list for sale in one request. This limit is subject to change periodically (usually it only goes up, but it is possible that we may need to decrease it at some point). This is not an account-based listing limit; this is only a limit on how many items can be listed in one sale queue (via the website) or one call to ListItems (via the API).

Output:

 * `listing_limit` The current listing limit
 
## <a name='ListItems'>ListItems(`array` items)</a>

Lists between 1 and 50 items for sale (upper cap subject to change). This will fail if any of the items passed in already have sales with active trade offers out. If there's a matching sale for an item that doesn't have a trade offer out, it will automatically be deleted.

Input:

 * `items` A JSON-encoded array of objects. One object for each item you wish to list. Each object should contain these properties:
     * `appid` The Steam AppID of the game which owns this item (e.g. 730 for CS:GO, 440 for TF2, 570 for Dota 2)
     * `contextid` The Steam context ID which contains this item (2 for Valve games, 6 for Steam Community items, 1 for H1Z1, etc.). When you right-click on an item in your Steam inventory and copy its URL, the context ID is the second number after the hash.
     * `assetid` The Steam asset ID of the item. This is also known as just the item's `id`
     * `price` The desired list price for this item, before commission. Pass this in USD cents (formerly known as OP). For example, $20.00 is 2000.
     * `addons` An array of strings (possible addon strings are listed below)
     * `featured` - Feature this item (costs $3.00 if you don't have a free featured credit available)
     * `screenshots` - Inspectable CS:GO items only: take screenshots of this item and display them (Instant Field Inspection). Costs 2% of list price, minimum $0.50. If you also feature this item, then the total cost of both addons is capped to $4.50.
     
Output:

 * `tradeoffer_id` If a trade offer was successfully sent, this is its ID as a string. If we weren't able to send a trade offer, this is `null`
 * `tradeoffer_error` If we weren't able to send a trade offer, this is an error message string. If there was no error, this is `null`
 * `bot_id` The internal OPSkins ID of the storage account to which these sales were assigned.
 * `bot_id64` The 64-bit SteamID of the storage account to which these sales were assigned. This is the account that's sending a trade offer.
 * `security_token` The 6-character security token that is included in the trade offer message.
 * `sales` An array containing objects describing the sales that were created. Each object has these properties:
     * `saleid` The OPSkins internal ID of this sale
     * `appid` The Steam AppID for this item
     * `contextid` The Steam context ID in which this item resides in your inventory
     * `assetid` The current asset ID of this item in your inventory
     * `market_name` The name of this item
     * `price` The list price of this item in USD cents
     * `addons` An array containing strings for each addon this item has
     
#Errors
     
json error BAD_INPUT:

    {
      "status": 3000,
      "message": "'items' must be a JSON array of objects"
    }
    
json error ACCESS_DENIED:

    {
      "status": 1002,
      "message": "You may not list items for sale while you are under the age of 18."
    }
    
json error GENERIC_USER_ACCOUNT_ERROR:

    {
      "status": 1000,
      "message": "Please go to your account page and set your Trade URL before attempting to list items."
    }
     
## <a name='EditPrice'>EditPrice(`int` saleid, `int` price)</a>

Edits the price of an item you currently have listed. If the item is in your OPSkins inventory, it lists it for sale.

Input:

 * `saleid` The ID of the sale/item you want to edit the price for (must be yours)
 * `price` The new price for your item, in USD cents. For example, to list an item for $4.00, use `400`
 
Output:

 * `relisted` true if the item was in your OPSkins inventory and has been re-listed, or false if it was already listed and its price has simply been edited.
 
## Errors

 * `NOT_FOUND` The requested sale ID does not exist or doesn't belong to you
 * `BAD_STATE` The requested sale ID is not currently on sale or in your OPSkins inventory, or it's in a bad state that requires support intervention or repair
 * `UNACCEPTABLE_PRICE` Your requested price is outside the acceptable range for all items, or the item has pricing restrictions on it and your price violates those restrictions
 * `ALREADY_IN_THAT_STATE` The item is already for sale for the requested price
 * `STEAM_UNAVAILABLE` When you re-list an inventory item, we grab the Steam inventory to make sure it's still there. If you're re-listing and Steam inventories are down, you get this error code.
 * `RATE_LIMIT_EXCEEDED` You can only edit the price of an item 10 times per day. You'll get this code if you try to edit it more than that many times.
 
json error if no matching sale was found

    {
      "status": 2002,
      "message": "No matching sale was found."
    }
    
Other possible error responses with corresponding status codes:

    2002 NOT_FOUND
    2003 BAD_STATE
    3003 UNACCEPTABLE_PRICE
    2012 ALREADY_IN_THAT_STATE
    4000 STEAM_UNAVAILABLE
    3008 RATE_LIMIT_EXCEEDED
    
## <a name='EditPriceMulti'>EditPriceMulti(`object` items)</a>

Queue price updates for up to 500 items. On success, this method will return an HTTP 202 Accepted status code and will respond immediately. The actual price updates will be queued and will be processed in the background. This will fail if you attempt to queue a price update for an item which already has a queued price update. Price update errors will not be reported and will be silently dropped in the background. For example, requests to edit the prices of items you do not own or which do not exist will be accepted, but will not actually be processed.

Input:

 * `items` And object where the keys are the OPSkins sale IDs and the values are new prices in USD cents.
 
Example:

    OPSkins.Sales.EditPriceMulti({ 1000: 500 });
    
Outputs nothing

## Errors

json error response RATE_LIMIT_EXCEEDED

    {
      "status": 3008,
      "message": "Another EditPriceMulti request is currently processing. Please wait for it to be accepted."
    }

json error response BAD_INPUT

    {
      "status": 3000,
      "message": "\"items\" must be in format items[itemid]=price"
    }

json error response BAD_STATE

    {
      "status": 2003,
      "message": "Item 1000 already has a price update queued. Its new price will be 1000"
    }

## <a name='BumpItems'>BumpItems(`array` items)</a>

Bump one or more items you've listed for sale to the top of the browse page and the featured (default) sort for search. Will cost $0.50 per item, but will use any free bump credits you may have (e.g. from a premium membership) first.

It is possible for bumping to fail for some items in this batch and to succeed for others.

The top-level `balance` property will be present in this method's response, containing your up-to-date account balance.

Input:

 * `items` An array of sale IDs of items you want to bump
 
Output:

 * `sales` An object whose keys are sale IDs and values are objects of the following structure:
     * `status` An ErrorCode value representing the status of the bump request for this item. Will be 1 (OK) on success.
     * `message` A string containing an error message, or "OK" on success.
     
#Errors

    {
      "status": 3000,
      "message": "No sale IDs supplied"
    }

json error response BAD_INPUT

    {
      "status": 3000,
      "message": "Invalid input; items must be a comma-separated list of sale IDs"
    }

json error response BAD_INPUT

    {
      "status": 3000,
      "message": "300 sale IDs supplied; only up to 100 may be supplied at one time"
    }

json error response GENERIC_INTERNAL_ERROR

    {
      "status": 2000,
      "message": "An unknown error occurred"
    }
    
## <a name='ReturnItems'>ReturnItems(`array` items)</a>

Return one or more items you've listed for sale to your Steam accounts. Input items must be either on sale or awaiting return, and must not have an active trade offer out or queued. Under most circumstances, a trade offer won't be queued, but it's possible if, for example, you request that an item be returned and the bot is offline at the time of request.

This will (attempt to) send trade offers for all items in your input. If multiple trade offers must be sent, they will be sent in series. Therefore, you may wish to call this method separately for each bot that will be sending an offer (you can use GetSales to find out which bot is holding which item).

If the `status` is not OK (1), the output will still be defined (if your input was well-formed, there were no unexpected internal errors, and Steam is not completely down) in the event that the failure was due to Steam (e.g. bad trade URL, item doesn't exist anymore, trade server down).

Input:

 * `items` An array of sale IDs of items you want returned
 
Output:

 * `offers` An array of objects, where each object in this array represents one trade offer that we sent (or tried to send)
 * `bot_id` The internal ID of the bot that sent (or tried to send) this trade offer
 * `items` An array of sale IDs which were in this offer
 * `tradeoffer_id` If the offer was successfully sent, this is its trade offer ID as a string. `null` on failure
 * `tradeoffer_error` If the offer couldn't be sent, this is an error message. `null` on success
 
#Errors

    {
      "status": 4000,
      "message": "Steam servers are currently unavailable. Please try again later."
    }

json error response BAD_INPUT

    {
      "status": 3000,
      "message": "Bad input for items"
    }

json error response NOT_FOUND

    {
      "status": 2002,
      "message": "One or more input items were not found."
    }

json error response NOT_FOUND

    {
      "status": 2002,
      "message": "No matching sale was found for ID ..."
    }

json error response BAD_STATE

    {
      "status": 2003,
      "message": "Sale ID ... is not in a returnable state."
    }

json error response BAD_STATE

    {
      "status": 2003,
      "message": "There was a problem with sale ID ... . Please contact support to resolve this issue."
    }
    
json error response STEAM_OFFER_FAILURE

    {
      "status": 4004,
      "message": "There was a problem sending some of your trade offers. Please try again later."
    }
    
## <a name='GetActiveTradeOffers'>GetActiveTradeOffers()</a>

Get the list of active trade offers which our bots have sent you.

Output:

 * `offers` An object whose keys are Steam trade offer IDs, and values are objects each with this structure:
     * `saleids` An array containing the OPSkins sale IDs of the items in this offer
     * `bot_id` The internal OPSkins ID of the bot which sent this trade
     * `bot_id64` The 64-bit SteamID of the bot which sent this trade
     * `type` A string, which may be one of pickup, return, or withdrawal
     
## <a name='Search'>Search(`string` app, *optional* `string` search_item, *optional* `float` min, *optional* `float` max )</a>
     
Search active OPSkins listings for particular items. This endpoint is relatively heavily rate-limited. Currently, it is limited to 20 requests per minute. To prevent bot sniping, this endpoint will only return listings which have been publicly visible for at least ten minutes, and are not currently limited to Buyers Club members. This endpoint always returns 100 listings sorted from lowest to highest price.

Input is identical to that of the main site's search page. The most important parameters are listed here.

 * `app` Required. This is the appid_contextid pair for the app you wish to search. For example, use `730_2` to search CS:GO listings.
 * `search_item` Optional. This is the search term which will be matched to item names. This uses fuzzy matching by default. Wrap your term in quotes to only return exact matches. For example, to find items containing the exact string "case key" (case-insensitive), then this value should be `"case key"`.
 * `min` Optional. The minimum item price to return, in USD. Note that this is different from most other currency displays which use USD cents. For example, pass `0.5` here to only search for items priced at $0.50 and up.
 * `max` Optional. The maximum item price to return, in USD.
 
Output:
 
 * `sales` An array of objects containing the results of your search query. Each object has these properties:
     * `id` The item's OPSkins sale ID
     * `amount` The item's list price, in USD cents
     * `classid` The item's Steam classid at time of pickup (may have changed in trade)
     * `instanceid` The item's Steam instanceid at time of pickup (may have changed in trade)
     * `img` The item's Steam image URL (append this to https://steamcommunity-a.akamaihd.net/economy/image/)
     * `market_name` The item's name
     * `inspect` The full URL to inspect this item, if applicable. If not, then this is null
     * `type` The item's "type" as reported by Steam (e.g. Base Grade Key)
     * `item_id` The item's Steam asset ID on our storage account
     * `stickers` A string containing the stickers applied to this item, as comma-separated pairs of stickerid,wear
     * `wear` The item's floating-point wear value, between 0 and 1 if applicable. If not applicable or unknown, then null
     * `appid` The item's Steam appID
     * `contextid` The item's Steam context ID
     * `bot_id` The internal OPSkins ID of the bot which is holding this item
     
Errors:

json error response RATE_LIMIT_EXCEEDED

    {
      "status": 3008,
      "message": "You already have a search request pending. Please wait for it to finish."
    }

json error response NOT_LOGGED_IN

    {
      "status": 1003,
      "message": "Please log in to view more results."
    }

json error response ACCESS_DENIED

    {
      "status": 1002,
      "message": "Please increase your Steam profile level to :min_buy_level to view more results."
    }
    
## <a name='BuyItems'>BuyItems(`array` saleids, `int` total)</a>

Purchase one or more items and deliver them to your OPSkins inventory. Once purchased, the item(s) can be delivered to your Steam inventory using [IInventory/Withdraw](#Withdraw). To prevent bot sniping, this endpoint will only purchase listings which have been publicly visible for at least ten minutes, and are not currently limited to Buyers Club members.

If this request succeeds, then it will contain a root-level `balance` property containing your new account balance after the purchase, in USD cents.

Input:

 * `saleids` An array of sale IDs for the items you wish to purchase. 300 maximum.
 * `total` The total cost of these items, in USD cents. For example, if you are purchasing a $2 item and a $1.23 item, then this should be 323. The request will fail if this does not match the actual total.

Output:

 * `items` An array of objects for the items you purchased. Each object has these properties:
     * `saleid` The OPSkins sale ID of the item. This will be one of the IDs you passed in your request.
     * `new_itemid` The new OPSkins ID of the item in your OPSkins inventory. This is the ID you will pass to Withdraw in order to withdraw the item to your Steam inventory. This will become the item's sale ID if you choose to re-list it.
     * `name` The name of the item
     * `bot_id` The internal OPSkins ID of the bot which is holding this item
     
#Errors

json error response STEAM_UNAVAILABLE

    {
      "status": 4000,
      "message": "Steam servers are currently unavailable"
    }

json error response BAD_INPUT

    {
      "status": 3000,
      "message": "Duplicate sale ID ..."
    }

json error response BAD_INPUT

    {
      "status": 3000,
      "message": "Non-numeric sale ID ..."
    }

json error response RATE_LIMIT_EXCEEDED

    {
      "status": 3008,
      "message": "Maximum of 300 items in request exceeded"
    }

json error response RATE_LIMIT_EXCEEDED

    {
      "status": 3008,
      "message": "You must wait until your previous purchase attempt completes"
    }

json error response NOT_FOUND

    {
      "status": 2002,
      "message": "Invalid sale ID provided"
    }

json error response BAD_STATE

    {
      "status": 2003,
      "message": "Expected total ... does not match actual total ..."
    }

json error response UNACCEPTABLE_ITEM

    {
      "status": 3001,
      "message": "Sale ... cannot be purchased as it is currently restricted to Buyers Club members."
    }

json error response NOT_ENOUGH_COINS

    {
      "status": 1001,
      "message": "You do not have enough wallet funds to complete this transaction."
    }

json error response BAD_STATE

    {
      "status": 2003,
      "message": "Sale ... is no longer available for purchase."
    }

json error response GENERIC_INTERNAL_ERROR

    {
      "status": 2000,
      "message": "An unknown error occurred."
    }
    
## <a name='GetLastSales'>GetLastSales(`int` appid, `int` contextid, `string` market_name, *optional* `string` val_1)</a>

Get data about the most recent sales for a given item.

Input:

 * `appid` The Steam AppID of the game which owns the item you're interested in
 * `contextid` The Steam context ID for the item you're interested in
 * `market_name` The full market name of the item you're interested in, for example: "AK-47 | Aquamarine Revenge (Field-Tested)"
 * `val_1` If you're interested in a particular variant of the item, this is its unusual effect index (for TF2) or pattern/paint index (for CS:GO)
 
Output:

The `response` of this method is an array of objects, where each object has these properties:

 * `id` The sale ID of the item that sold
 * `amount` The amount the item sold for, in USD cents
 * `wear` The item's wear as a float, or null if unknown or not applicable
 * `timestamp` The Unix timestamp of when this item sold
 
## <a name='GetSaleStatuses'>GetSaleStatuses()</a>

Output:

 * `statuses` An array containing objects, where each object has the following properties
 * `key` The integer code that corresponds to this sale state
 * `name` The localized string that corresponds to this sale state
 
# <a name='status-methods'>Status</a>

!! These methods are used accessing the 'Status' property !!

Example:

    OPSkins.Status.GetBotList().then(data => {
        console.log(data);
    });

## <a name='GetSaleStatuses'>GetSaleStatuses()</a>

Retrieves a listing of all active OPSkins bots, namely their internal IDs (the number in their Steam name), their SteamIDs, and their online status.

You may wish to note that some internal IDs have either been skipped or retired, so this list is not exactly sequential.

Output:

 * `bots` An object whose keys are internal bot IDs and values are objects with this structure:
 * `id` The bot's internal ID
 * `id64` The bot's 64-bit SteamID as a string
 * `online` A boolean indicating whether this bot is currently online and available for trading
 
# <a name='support-methods'>Support</a>

!! These methods are used accessing the 'Support' property !!

Example:

    OPSkins.Support.RepairItem(1337).then(data => {
        console.log(data);
    });
    
## <a name='RepairItem'>RepairItem(`int` saleid)</a>

Input:

 * `saleid` - The ID of the sale (or on-site inventory item) that you want to attempt to repair
 
Output:

 * `type` - A string representing what type of item this is in your account
     * `sale` for an item you're selling
     * `purchase` for an item you purchased
     * `item` for an item in your OPSkins inventory
 * `bot` - The ID of the bot which owns this item
 * `repairedSaleids` - An array containing the IDs of other items on this bot which are also repaired (will contain the passed-in ID if it was repaired). Some or all of these may not belong to you.
 * `repaired` - 1 if the passed-in ID was repaired, 0 if it wasn't. You'll need to contact support if it's 0. Will also be 1 if the passed-in ID was not in a bad state to begin with.
 
# <a name='user-methods'>User</a>

!! These methods are used accessing the 'User' property !!

Example:

    OPSkins.User.GetBalance().then(data => {
        console.log(data);
    });
    
## <a name='GetBalance'>GetBalance()</a>

Used to get the current balance of your OPSkins account.

Output:

None beyond the standard balance property, as defined in the [API overview](https://opskins.com/kb/api-v2#responses).

## <a name='SaveTradeURL'>SaveTradeURL(`string` trade_url)</a>

Update your account's trade URL.

Input:

 * `trade_url` Your new trade URL. Must be for the Steam account linked with this OPSkins account, or else will be rejected.

Outputs nothing