const mongoose = require('mongoose');
const moment = require('moment');

const battleSchema = new mongoose.Schema(
	{
		contest: {type: mongoose.Schema.Types.ObjectId, ref: 'Contest'},
		players: [{type: mongoose.Schema.Types.ObjectId, ref: 'Submission'}],
		result: {type: String, enum: ['pending', 'draw', 'settled']},
		winner: Number,
	},
	{timestamps: true}
);

battleSchema.methods.versusText = function() {
	return this.players.map((submission) => submission.userText()).join(' vs ');
};

battleSchema.methods.timeText = function() {
	return moment(this.createdAt)
		.utcOffset(9)
		.format('YYYY/MM/DD HH:mm:ss');
};

battleSchema.methods.getOpponents = function(submission) {
	return this.players.filter(({_id}) => !_id.equals(submission._id));
};

battleSchema.methods.getWinner = function () {
	return this.players[this.winner];
}

module.exports = mongoose.model('Battle', battleSchema);
