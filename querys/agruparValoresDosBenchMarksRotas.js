db.benchmarks.aggregate(
   [
     {
        $match: { "tipo": 4 }  
     },
     {
       $group:
         {
           _id: "$name",
           avgDuration: { $avg: '$duration'},
         }
     },
     {
        $sort: {"_id": 1}
     }
   ]
);