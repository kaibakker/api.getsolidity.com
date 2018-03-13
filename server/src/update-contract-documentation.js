const mongoose = require('mongoose')


const Contract = require('../models/contract')

const Documentation = require('../models/documentation')



// https://api.etherscan.io/api?module=contract&action=getabi&address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413&apikey=YourApiKeyToken

Contract.find({}).limit(100).then((contracts) => {
  const list = []
  Documentation.findOne({}).then((documentation) => {

    contracts.forEach((contract) => {
      const text_signatures = contract.abi.map((abiItem) => {
        return `${ abiItem.name }(${ abiItem.inputs.map(({type}) => { return type }).join(',') })`
      })

      contract["x-interfaceIds"] = [mongoose.Types.ObjectId("5aa7b3489c7aded02dc0b91e")]
      console.log(contract.contractName)
      contract.save()

    })

  })


})



// <React componentHash="05yz" dataHash="0x34234" />

// componentFunction = ComponentFunctions["05zyz"]
// componentData = ComponentFunctions["05zyz"]
//
//
// <componentFunction data={componentData} dataHash="" />
