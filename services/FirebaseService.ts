import {
  collection,
  doc,
  DocumentData,
  documentId,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "utils/clientApp";

export class FirebaseService {
  private async findInCollection<T>(
    transactionId: string,
    collectionName: string,
    key = "transactionId",
  ) {
    try {
      const withDrawCollection = collection(firestore, collectionName);

      const withdrawsQuery = query(
        withDrawCollection,
        where(key, "==", transactionId),
        limit(1),
      );

      const querySnapshot = await getDocs(withdrawsQuery);

      const result: QueryDocumentSnapshot<DocumentData>[] = [];

      querySnapshot.forEach((snapshot) => {
        result.push(snapshot);
      });

      if (result.length === 0) {
        return null;
      }

      return result[0].data() as T;
    } catch (error) {
      return null;
    }
  }

  async deposit(transactionId: string, data: any) {
    try {
      const _deposit = doc(firestore, `deposits/${transactionId}`);

      await setDoc(_deposit, data);

      return {
        error: false,
        message: "Depósito registrado com sucesso",
        data: null,
      };
    } catch (error) {
      return {
        error: true,
        message: "Falha ao registrar depósito",
        data: error,
      };
    }
  }

  async findWithdrawByPartnerOrderNumber<T = any>(
    partner_order_number: string,
  ) {
    return this.findInCollection<T>(
      partner_order_number,
      "withdraws",
      "partner_order_number",
    );
  }

  async findWithdrawByTransactionId<T = any>(transactionId: string) {
    return this.findInCollection<T>(transactionId, "withdraws");
  }

  async findDepositByTransactionId<T = any>(transactionId: string) {
    return this.findInCollection<T>(transactionId, "deposits", documentId());
  }

  async updateWithdrawByTransactionId(transactionId: string, data: any) {
    try {
      const withdrawRef = doc(firestore, `withdraws/${transactionId}`);

      await updateDoc(withdrawRef, data);
    } catch (error) {
      return null;
    }
  }

  async updateDepositByTransactionId(transactionId: string, data: any) {
    try {
      const depositRef = doc(firestore, `deposits/${transactionId}`);

      await updateDoc(depositRef, data);
    } catch (error) {
      return null;
    }
  }
}
