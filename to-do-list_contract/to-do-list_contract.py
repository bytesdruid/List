#  Testnet APP ID = 120454587

from pyteal import *

"""Critical Task List"""

def approval_program():
    handle_creation = Seq([
        # sets the global put as To-Do List
        App.globalPut(Bytes("dApp Title"), Bytes("Critical Task List")),
        Return(Int(1))
    ])

    # allows you to change the global app title
    change_title = Seq(
        # asserts that there should only be two app args
        Assert(Txn.application_args.length() == Int(2)),
        # only the app creator may change the title
        Assert(Txn.sender() == Global.creator_address()),
        # changes the title global key to the value provided in the app arg array
        App.globalPut(Bytes("dApp Title"), Txn.application_args[1]),
        # approve sequence
        Return(Int(1))
    )

    handle_optin = Seq(
        # initializes array which will hold our list
        App.localPut(Txn.sender(), Bytes("Array_Length"), Txn.local_num_byte_slices()),
        # approve sequence
        Return(Int(1))
    )

    handle_closeout = Return(Int(0))
    handle_updateapp = Return(Int(0))
    handle_deleteapp = Return(Int(0))

    # sets task 1
    set_item_1 = Seq([
        # expecting four app args
        Assert(Txn.application_args.length() == Int(4)),
        # task name
        App.localPut(Txn.sender(), Bytes('0'), Txn.application_args[2]),
        # description of task
        App.localPut(Txn.sender(), Bytes('1'), Txn.application_args[3]),
        # intializes complete to false
        App.localPut(Txn.sender(), Bytes('2'), Bytes('false')),
        # approve sequence
        Return(Int(1))
    ])

    # sets task 2
    set_item_2 = Seq([
        # expecting four app args
        Assert(Txn.application_args.length() == Int(4)),
        # task name
        App.localPut(Txn.sender(), Bytes('3'), Txn.application_args[2]),
        # description of task
        App.localPut(Txn.sender(), Bytes('4'), Txn.application_args[3]),
        # intializes complete to false
        App.localPut(Txn.sender(), Bytes('5'), Bytes('false')),
        # approve sequence
        Return(Int(1))
    ])

    # sets task 3
    set_item_3 = Seq([
        # expecting four app args
        Assert(Txn.application_args.length() == Int(4)),
        # task name
        App.localPut(Txn.sender(), Bytes('6'), Txn.application_args[2]),
        # description of task
        App.localPut(Txn.sender(), Bytes('7'), Txn.application_args[3]),
        # intializes complete to false
        App.localPut(Txn.sender(), Bytes('8'), Bytes('false')),
        # approve sequence
        Return(Int(1))
    ])

    # subroutines to mark task 1 complete
    mark_complete_1 = Seq(
        # expecting one app arg
        Assert(Txn.application_args.length() == Int(1)),
        # sets complete to true
        App.localPut(Txn.sender(), Bytes('2'), Bytes('true')),
        # approve sequence
        Return(Int(1))
    )

    # subroutines to mark task 2 complete
    mark_complete_2 = Seq(
        # expecting one app arg
        Assert(Txn.application_args.length() == Int(1)),
        # sets complete to true
        App.localPut(Txn.sender(), Bytes('5'), Bytes('true')),
        # approve sequence
        Return(Int(1))
    )

    # subroutines to mark task 3 complete
    mark_complete_3 = Seq(
        # expecting one app arg
        Assert(Txn.application_args.length() == Int(1)),
        # sets complete to true
        App.localPut(Txn.sender(), Bytes('8'), Bytes('true')),
        # approve sequence
        Return(Int(1))
    )

    handle_noop = Cond(
            [Txn.application_args[0] == Bytes("Set_Item_1"), set_item_1],
            [Txn.application_args[0] == Bytes("Set_Item_2"), set_item_2],
            [Txn.application_args[0] == Bytes("Set_Item_3"), set_item_3],
            [Txn.application_args[0] == Bytes("Mark_Complete_1"), mark_complete_1],
            [Txn.application_args[0] == Bytes("Mark_Complete_2"), mark_complete_2],
            [Txn.application_args[0] == Bytes("Mark_Complete_3"), mark_complete_3],
            [Txn.application_args[0] == Bytes("Change_Title"), change_title]
        )

    program = Cond(
        [Txn.application_id() == Int(0), handle_creation],
        [Txn.on_completion() == OnComplete.OptIn, handle_optin],
        [Txn.on_completion() == OnComplete.CloseOut, handle_closeout],
        [Txn.on_completion() == OnComplete.UpdateApplication, handle_updateapp],
        [Txn.on_completion() == OnComplete.DeleteApplication, handle_deleteapp],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop]
    )

    return compileTeal(program, Mode.Application, version=5)


def clear_state_program():
    program = Return(Int(1))
    return compileTeal(program, Mode.Application, version=5)

# 7 - update the file to 
# print out the results
appFile = open('approval.teal', 'w')
appFile.write(approval_program())
appFile.close()

clearFile = open('clear.teal', 'w')
clearFile.write(clear_state_program())
clearFile.close()