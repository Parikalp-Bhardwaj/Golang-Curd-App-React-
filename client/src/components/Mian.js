import React,{useState,useEffect} from "react"
import { useToast } from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box
  } from '@chakra-ui/react'


const Main = ()=>{
    const [data,setData] = useState([])
    const [dataloading,setLoading] = useState(true)
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [contact,setContact] = useState('')
    const [address,setAddress] = useState('')
    const toast = useToast()
    
    const getData = ()=>{
        fetch("/users")
        .then(res => res.json())
        .then(data => setData(data))

        setLoading(false)
    }
    

    useEffect(()=>{
        getData()

    },[!setLoading && data])

    const submitInfo = (e)=>{
        e.preventDefault()
        if (!name || !email || !contact || !address ){
            alert("Please fill all input")
        }

        else{

        
        fetch("/users",{
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            "name":name,
            "email":email,
            "contact":contact,
            "address":address
        })})

        // console.log(name,email,contact,address)
        toast({
            title: 'User Created.',
            description: "We've created a new user.",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        

        }
        
        setName("")
        setEmail("")
        setContact("")
        setAddress("")
        getData()
    }

    const deleteOne = (id) =>{
        console.log("id  ",id)

        fetch(`/users/${id}`,{method:"DELETE",headers:{"Content-Type":"application/json"}})

        getData()
        console.log("Deleted.. ")
    }

    return (
        <div>
            <div>
                <nav className="bg-zinc-500 h-20 flex">
                    <ul className="flex mt-7 ml-16">
                        <li className="mr-16 text-white cursor-pointer">Home</li>
                        <li className="mr-16 text-white cursor-pointer">About</li>
                        <li className="mr-16 text-white cursor-pointer">Contact</li>
                        
                    </ul>
                </nav>
            </div>
            <div className="flex mt-5 justify-center">

                <input className="mr-2 mt-2  p-2 w-56 bg-zinc-600 text-white border-solid rounded" 
                 type='text' name="name" value={name} placeholder="Enter Your name" onChange={(e)=>setName(e.target.value)} />
                <input className="mr-2 p-2 w-56 bg-zinc-600 text-white border-solid rounded mt-2" 
                type='email' name="email" value={email} placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)} />
                <input className="mr-2 p-2 w-56 bg-zinc-600 text-white border-solid rounded mt-2" 
                type='number' name="contact" value={contact} placeholder="Enter Your Contact" onChange={(e)=>setContact(Number(e.target.value))} />
                <input className="mr-2 p-2 w-56 bg-zinc-600 text-white border-solid rounded mt-2" 
                type='address' name="address" value={address} placeholder="Enter Your Address" onChange={(e)=>setAddress(e.target.value)} />
                <button className="bg-black hover:bg-slate-100 w-24 h-10 mt-2 text-white
                 hover:text-black active:bg-slate-800 active:text-white" onClick={submitInfo}>Submit</button>
            </div>



            <div className="flex justify-center mt-10">
            
            <Box bg='black' w='70%' p={4} color='white'>
            <TableContainer>
                <Table>
                    <Thead>
                    <Tr>
                        <Th><span className="text-white">Name</span></Th>
                        <Th><span className="text-white">Email</span></Th>
                        <Th Numeric><span className="text-white">Contact</span></Th>
                        <Th><span className="text-white">Address</span></Th>
                        <Th><span className="text-white">Delete</span></Th>
                    </Tr>
                    </Thead>
                    
                    
                    {data.map((val)=>{
                        return(
                            <Tbody key={val._id}>
                                <Tr >
                                    <Td>{val.name}</Td>
                                    <Td>{val.email}</Td>
                                    <Td>{val.contact}</Td>
                                    <Td>{val.address}</Td>
                                    <Td><button className="bg-red-500 rounded w-20"
                                    onClick={()=>deleteOne(val._id)}>Delete</button></Td>
                                    
                                </Tr>
                            </Tbody>
                        )
                    })}
                   
                 
                    
                </Table>
            </TableContainer>
            </Box>
            </div>
        </div>
    )

}

export default Main
