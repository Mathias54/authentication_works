db.benchmarks.aggregate(
   [
     {
        $match: { "tipo": 2 }  
     },
     {
       $group:
         {
           _id: "$name",
           avgAmount: { $avg: '$duration'}
         }
     },
     {
        $sort: {"_id": 1}
     }
   ]
)